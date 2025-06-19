import Badge from 'react-bootstrap/Badge';
import { apiFetch } from "@/lib/api";
import { Button } from 'react-bootstrap';
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
    else{
        typeBadge = <div className="mt-1">
          <Badge bg="secondary" pill>
            {type}
          </Badge>
        </div>;
    }
    const notificationSeen = async(notificationId) =>{
        try{
            const res = await apiFetch(`/notification/${notificationId}`, {
                method: "PUT"
            });
        }catch(err) {console.log(err)}
    }
  return (
    <div
      className={`d-flex flex-column p-2 border-bottom text-dark`}
      style={{ fontSize: "0.9rem" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <strong>{from} {seen? "👁" : ""}</strong>
        <small className="text">{formatTime}</small>
        <Button onClick={() => notificationSeen(notificationId)}>Seen </Button>
      </div>
      <div className="text">{message}</div>
      {type && (
        typeBadge
      )}
    </div>
  );
}

