import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import { UserContext } from "../../context/UserContext.tsx"
import {
  changeAvatar,
  changeNickname,
  defaultAvatar,
  disable2fa,
  generateQR,
  getUsers,
  verifyQR
} from "../../api/user.ts"
import { useParams } from "react-router-dom"
import { user, userStatus } from "../../types/index.ts"
import UserInfo from "../../components/UserInfo/UserInfo.tsx"
import "./Profile.scss"
import { SocketContext } from "../../context/SocketContext.tsx"
import LoadIndicator from "../../components/LoadIndicator/LoadIndicator.tsx"

export default function Profile() {
  const [editView, setEditView] = useState(false)
  const [currentUser, setCurrentUser] = useState<user>(null)
  const { username } = useParams()
  const { user } = useContext(UserContext)
  const socket = useContext(SocketContext)

  useEffect(() => {
    async function getUserInfo() {
      if (username === undefined) {
        setCurrentUser(user)
      } else {
        const userList = await getUsers(username)
        const foundUser = userList.find(
          (user: user) => user.username === username
        )
        if (foundUser !== undefined) {
          setCurrentUser(foundUser)
        }
      }
    }

    if (user) {
      getUserInfo()
    }
  }, [username, user])

  useEffect(() => {
    if (currentUser) {
      if (currentUser.status !== userStatus.BLOCKED) {
        socket.on(currentUser.username, (data: userStatus) => {
          setCurrentUser(current => {
            return { ...current, status: data }
          })
        })
      }
    }

    return () => {
      if (currentUser) {
        socket.off(currentUser.username)
      }
    }
  }, [currentUser])

  if (currentUser === null) {
    return <p>No such user</p>
  }

  return (
    <div className="profile">
      <h1>Profile</h1>
      {editView ? (
        <button
          className="edit"
          onClick={() => {
            setEditView(false)
          }}
        >
          Back
        </button>
      ) : (
        <button
          className="edit"
          onClick={() => {
            setEditView(true)
          }}
        >
          Edit
        </button>
      )}
      {editView ? (
        <EditProfile />
      ) : (
        <>
          <UserInfo user={currentUser} />
        </>
      )}
    </div>
  )
}

function EditProfile() {
  return (
    <div className={"edit-profile"}>
      <ChangeNickname />
      <UploadAndDisplayImage />
      <TwoFactorAuth />
    </div>
  )
}

function ChangeNickname() {
  const { user, setUser } = useContext(UserContext)
  const [nickname, setNickname] = useState(user.displayName)
  const [showInput, setShowInput] = useState<boolean>(false)

  return (
    <div>
      <h2>Nickname</h2>
      <b>Nickname:</b>
      {!showInput ? (
        <>
          <span>{user.displayName}</span>
          <br />
          <button
            onClick={() => {
              setShowInput(true)
            }}
          >
            Edit Nickname
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={nickname}
            onChange={e => {
              setNickname(e.target.value)
            }}
          />
          <span
            className={
              nickname.length === 0 || nickname.length > 12 ? "not-valid" : ""
            }
          >
            {nickname.length}/12
          </span>
          <br />
          <button
            disabled={nickname.length === 0 || nickname.length > 12}
            onClick={async () => {
              await changeNickname({
                id: user.id,
                displayName: nickname
              })
              setUser({ ...user, displayName: nickname })
              setShowInput(false)
            }}
          >
            Set
          </button>
          <button
            onClick={() => {
              setNickname(user.displayName)
              setShowInput(false)
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  )
}

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState<File>(null)
  const [showInput, setShowInput] = useState<boolean>(false)
  const fileInput = useRef(null)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (selectedImage) console.log(selectedImage.size)
  }, [selectedImage])

  return (
    <div className="edit-avatar">
      <h2>Avatar</h2>
      {!showInput ? (
        <>
          <h3>Current Avatar</h3>
          <button
            onClick={() => {
              setShowInput(true)
            }}
          >
            Change Avatar
          </button>
          <div className="current-avatar">
            <img src={user.avatar} alt="" />
          </div>
        </>
      ) : (
        <>
          <h3>Set a new Avatar</h3>
          {selectedImage && (
            <div>
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
              <br />

              <ImageSizeIndicator
                selectedImageState={[selectedImage, setSelectedImage]}
              />
            </div>
          )}

          {!selectedImage && (
            <>
              <button
                onClick={() => {
                  setShowInput(false)
                }}
              >
                Cancel
              </button>
              <button onClick={async () => {
                await defaultAvatar()
                window.location.reload()
              }}>Set to default avatar</button>
              <br />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                name="myImage"
                onChange={event => {
                  setSelectedImage(event.target.files[0])
                }}
              />
              <p>Allowed size for images is up to 1 MB</p>
            </>
          )}
        </>
      )}
    </div>
  )
}

function ImageSizeIndicator({
  selectedImageState: [selectedImage, setSelectedImage]
}: PropsWithChildren<{ selectedImageState: [File, Function] }>) {
  const sizeInKilobytes = (selectedImage.size / 1000).toFixed()
  const [buttonDisable, setButtonDisable] = useState(false)
  return (
    <>
      <p>
        Image size:{" "}
        <span className={selectedImage.size > 1_000_000 ? "not-valid" : ""}>
          {sizeInKilobytes}
        </span>
        /1000 KB
      </p>
      <button onClick={() => setSelectedImage(null)}>Remove</button>
      {selectedImage.size <= 1_000_000 && (
        <button
          onClick={async () => {
            setButtonDisable(true)
            const formData = new FormData()
            formData.append("file", selectedImage, selectedImage.name)
            await changeAvatar(formData)
            window.location.reload()
          }}
          disabled={buttonDisable}
        >
          Update Avatar
        </button>
      )}
    </>
  )
}

function TwoFactorAuth() {
  const { user } = useContext(UserContext)
  return (
    <div className="two-factor">
      <h3>2FA</h3>
      {!user.twoFactorEnabled && <EnableTwoFactor />}
      {user.twoFactorEnabled && (
        <>
          <p>2FA is enabled</p>
          <button
            onClick={async () => {
              await disable2fa()
              window.location.reload()
            }}
          >
            Disable 2FA
          </button>
        </>
      )}
    </div>
  )
}

function EnableTwoFactor() {
  const [enable, setEnable] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [code, setCode] = useState("")

  return (
    <>
      {enable ? (
        <>
          {qrUrl ? (
            <div className="qr-form">
              <img src={qrUrl} alt="QR Code" />
              <form onSubmit={async (e) => {
                if (code.length) {
                  e.preventDefault()
                  await verifyQR({ token: code })
                  window.location.reload()
                }
              }}>
                <p>
                  Scan the QR with an authentication app and enter the code to
                  activate 2FA
                </p>
                <input
                  type="text"
                  value={code}
                  onChange={e => {
                    setCode(e.target.value)
                  }}
                />
                <button>Confirm</button>
              </form>
            </div>
          ) : (
            <LoadIndicator />
          )}
        </>
      ) : (
        <button
          onClick={() => {
            setEnable(true)
            generateQR().then(res => {
              setQrUrl(res.qrcode)
            })
          }}
        >
          Enable 2FA
        </button>
      )}
    </>
  )
}
