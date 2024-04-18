// Define an interface for the Event
interface Timeslot {
    id: string;
    parentId:string
    startTime: Date;
    endTime: Date;
    allDay: boolean
    participant: string // Assuming each participant is identified by a unique identifier
  }
  
  export default Timeslot;
  