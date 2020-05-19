import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../app/models/activity";

interface IProps {
  attendees: IAttendee[];
}
const styles = {
  borderColor:'orange',
  borderWidth:2,
}
export const ActivityListItemAttendee: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.userName}>
            <Popup header={attendee.display}
            trigger={<Image
                size="mini"
                circular
                src={attendee.image || "/assets/user.png"}
                bordered
                style={attendee.following ? styles :null}
              />}></Popup>
          
        </List.Item>
      ))}
    </List>
  );
};
