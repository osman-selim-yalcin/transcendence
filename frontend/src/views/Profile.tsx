import { useContext, useRef, useState } from "react"
import UserInfo from "../components/UserInfo.tsx"
import { UserContext } from "../context/UserContext.tsx"
import { changeAvatar } from "../api/user.ts"

export default function Profile() {
  const [editView, setEditView] = useState(false)

  return (
    <div>
      <h1>Profile</h1>
      {editView ? <button onClick={() => { setEditView(false) }}>Back</button> : <button onClick={() => { setEditView(true) }}>Edit</button>}
      {editView ? <EditProfile /> :
        <>
          <UserInfo />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, magni soluta sequi, doloremque iure inventore pariatur fugiat ipsa praesentium repudiandae a explicabo esse laboriosam quos ratione natus, nostrum illo. Odio!
            Cum optio consequuntur perspiciatis porro nostrum reiciendis eum obcaecati. Praesentium architecto unde repellendus cum dolores asperiores adipisci optio, eaque qui accusamus, temporibus cupiditate consectetur voluptatem quo voluptate distinctio alias laboriosam.
            Reiciendis fuga porro nihil. Quia numquam voluptatem ducimus deleniti natus sed ab ea tenetur, vero quam adipisci optio ullam temporibus omnis voluptate libero aliquid molestias eum itaque? Excepturi, temporibus recusandae!
            Vel cum corporis aliquam vitae facere odit laudantium consectetur hic earum obcaecati repudiandae ex quis quisquam est nostrum eum recusandae laborum ut quasi harum suscipit omnis, dolor asperiores doloribus! Repellat?
          </p>
        </>
      }
    </div>
  )
}

function EditProfile() {
  return (
    <div className={"edit-profile"}>
      <ChangeNickname />
      <br /><br />
      <UploadAndDisplayImage />
    </div>
  )
}

function ChangeNickname() {
  const { user } = useContext(UserContext)
  const [nickname, setNickname] = useState(user.username)
  const [showInput, setShowInput] = useState<boolean>(false)
  return (
    <>
      <h2>Nickname</h2>
      <b>
        Nickname:
      </b>
      {!showInput ?
        <>
          <span>
            {user.username}
          </span>
          <br />
          <button onClick={() => {
            setShowInput(true)
          }}>Edit Nickname</button>
        </>
        :
        <>
          <input type="text" value={nickname} onChange={(e) => { setNickname(e.target.value) }} />
          <br />
          <button onClick={() => { }}>Set</button>
          <button onClick={() => {
            setNickname(user.username)
            setShowInput(false)
          }}>Cancel</button>
        </>
      }
    </>
  )
}

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState<Blob>(null);
  const [showInput, setShowInput] = useState<boolean>(false)
  const fileInput = useRef(null)
  const { user } = useContext(UserContext)

  return (
    <div>
      <h2>Avatar</h2>
      {!showInput ?
        <>
          <h3>
            Current Avatar
          </h3>
          <button onClick={() => {
            setShowInput(true)
          }}>Change Avatar</button>
          <div className="current-avatar">
            <img src={user.avatar} alt="" />
          </div>
        </>
        :
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
              <button onClick={() => setSelectedImage(null)}>Remove</button>
              <button onClick={async () => {
                const formData = new FormData()
                formData.append("image", selectedImage, selectedImage.name)
                await changeAvatar(formData)
                window.location.reload()
              }}>Update Avatar</button>
            </div>
          )}

          {!selectedImage &&
            <>
              <button onClick={() => {
                setShowInput(false)
              }}>Cancel</button>
              <br />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                name="myImage"
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);
                }}
              />
            </>
          }
        </>
      }
    </div>
  );
};