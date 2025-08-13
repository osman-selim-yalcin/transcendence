import NotificationsIcon from "@mui/icons-material/Notifications"
import {
  Badge,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from "@mui/material"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

export default function Notification() {
  const { notifications } = useContext(UserContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {/* Icon Button with badge */}
      <IconButton
        aria-label="notifications"
        onClick={handleClick}
        color="inherit"
      >
        <Badge color="error" variant="dot" invisible={!notifications?.length}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* MUI Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Typography variant="subtitle1" sx={{ px: 2, py: 1, fontWeight: 600 }}>
          Notifications
        </Typography>
        <Divider />

        {notifications?.length ? (
          notifications.map((n, i) => (
            <MenuItem key={i} onClick={handleClose}>
              <ListItemText
                primary={n.content || "New notification"}
                secondary={n.createdAt || ""}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No notifications" />
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
