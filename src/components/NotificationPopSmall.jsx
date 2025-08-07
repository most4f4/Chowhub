import Badge from 'react-bootstrap/Badge';
import { apiFetch } from "@/lib/api";
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';
export default function NotificationPopSmall({from, message, seen, timestamp, type, notificationId}){
    const formatTime = new Date(timestamp).toLocaleDateString();
    let typeBadge; 
    if(type == 'user-activated'){
        typeBadge = <div className="mt-1">
          <Badge bg="success" pill>
            {type}
          </Badge>
        </div>;
    }
    else if(type =='low-stock'){
      typeBadge = <div className="mt-1">
          <Badge bg="warning" pill>
            {type}
          </Badge>
        </div>;
    }
    else{
        typeBadge = <div className="mt-1">
          <Badge bg="secondary" pill>
            {type}
          </Badge>
        </div>;
    }

      useEffect(() => {
    if (!seen) {
      notificationSeen(notificationId);
    }
  }, [notificationId, seen]);
    const notificationSeen = async(notificationId) =>{
        try{
            const res = await apiFetch(`/notification/${notificationId}`, {
                method: "PUT"
            });
        }catch(err) {console.log(err)}
    }
  return (
    <div
      style={{
        flex: 1,
        background: "#2A2A3A",
        borderRadius: 12,
        padding: "1.25rem",
        margin:"1rem",
        // border: `2px solid `,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="d-flex justify-content-between align-items-center"
              style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.5rem",
        }}>
        <strong >{from} {seen? "👁" : ""}</strong>
        <small style={{ color: "#BBB" }} className="text">{formatTime}</small>
        {/* <Button onClick={() => notificationSeen(notificationId)}>Seen </Button> */}
      </div>
      <div   style={{ marginBottom: "0.5rem" }} className="text">{message}</div>
      {type && (
        typeBadge
      )}
    </div>
  );
}

