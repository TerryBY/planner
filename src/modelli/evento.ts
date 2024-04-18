// Define an interface for the Event
interface Event {
    id: string;
    title: string;
    description: string;
    organizer: string;
    startTime: Date;
    endTime: Date;
    participants: string[]; // Assuming each participant is identified by a unique identifier
    state?: string;
  }
  
  export default Event;
  