import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonDatetime,
  IonInput,
  IonTextarea,
  IonAlert,
} from '@ionic/react';
import { list, sendOutline, personCircleOutline, push, navigate } from 'ionicons/icons';
import { useHistory } from 'react-router';
// Importa l'interfaccia Event
import Event from '../../modelli/evento';
import { fakerIT } from '@faker-js/faker';

// Esempio di elenco di eventi (sostituisci questo con i tuoi dati effettivi)


const Eventi: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    id: '', // You might want to generate a unique ID here
    title: '',
    description: '',
    organizer: '',
    startTime: new Date(),
    endTime: new Date(),
    participants: [],
  });
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [currentDisplay, setcurrentDisplay] = useState('default');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [navigate, setNavigate] = useState(() => { });
  const [showAlertState, setShowAlertState] = useState(false);
  const [alertSubHeader, setAlertSubHeader] = useState('Default Subtitle');
  const [alertMessage, setAlertMessage] = useState('Default Message');
  const showAlert = (subHeader: string, message: string, implement?: () => void) => {
    setAlertSubHeader(subHeader);
    setAlertMessage(message);
    setShowAlertState(true);
    setNavigate(implement || (() => { }));
  }
  const history = useHistory();
  const generateRandomEvent = (i: string): Event => {
    const id = i;
    const title = fakerIT.location.city();
    const description = fakerIT.lorem.words(4);
    const organizer = fakerIT.person.fullName();
    const startTime = fakerIT.date.soon();
    const endTime = fakerIT.date.future();

    const participants: never[] = []; // Example: generate unique participant IDs

    return {
      id,
      title,
      description,
      organizer,
      startTime,
      endTime,
      participants,
    };
  };
  const handleEventChange = (field: string, e: any) => {
    // Convert the date-time string to a Date object
    const dateValue = new Date(e.detail.value);

    if (field === 'start') {
      setNewEvent((prevEvent) => ({ ...prevEvent, startTime: dateValue }));
    } else if (field === 'end') {
      setNewEvent((prevEvent) => ({ ...prevEvent, endTime: dateValue }));
    }

    else // Update the field value in newEvent
      setNewEvent((prevEvent) => ({ ...prevEvent, [field]: e.detail.value }));

  };
  // Function to generate an array of x random events
  const generateRandomEvents = (x: number): Event[] => {
    const events: Event[] = [];
    for (let i = 0; i < x; i++) {
      events.push(generateRandomEvent(i.toString()));
    }
    return events;
  };
  const handleSegmentChange = (event: CustomEvent) => {
    const segmentValue = event.detail.value;
    setSelectedSegment(segmentValue);
    // You can implement logic here to filter events based on the selected segment
  };

  const AllEvents = () => (
    <>
      {events?.map((event) => (
        <IonButton key={event.id} expand="full" fill="clear" onClick={() => handleEventClick(event.id)}>
          <IonItem>
            <IonLabel>
              <h2>{event.title}</h2>
              <p>{`Organizzatore: ${event.organizer}`}</p>
              <p>{`Ora di inizio: ${event.startTime.toLocaleString()}`}</p>
              <p>{`Ora di fine: ${event.endTime.toLocaleString()}`}</p>
            </IonLabel>
          </IonItem>
        </IonButton>
      ))}

    </>

  );
  const MyEventList = () => (

    <>
      {myEvents && myEvents.length > 0 ? (
        myEvents.map((event) => (
          <IonButton key={event.id} expand="full" fill="clear" onClick={() => handleEventClick(event.id)}>
            <IonItem>
              <IonLabel>
                <h2>{event.title}</h2>
                <p>{`Organizzatore: ${event.organizer}`}</p>
                <p>{`Ora di inizio: ${event.startTime.toLocaleString()}`}</p>
                <p>{`Ora di fine: ${event.endTime.toLocaleString()}`}</p>
              </IonLabel>
            </IonItem>
          </IonButton>
        ))
      ) : (
        <IonLabel>Non ci sono eventi</IonLabel>
      )}


    </>
  );
  const AddEvent = () => (
    <>
      <IonLabel position="stacked">Titolo</IonLabel>
      <IonInput
        name="title"
        value={newEvent?.title}
        onIonChange={(e) => (handleEventChange('title', e))}
      ></IonInput>

      <IonLabel position="stacked">Descrizione</IonLabel>
      <IonTextarea
        name="description"
        value={newEvent?.description}
        onIonChange={(e) => (handleEventChange('description', e))}
      ></IonTextarea>

      <IonLabel position="stacked">Organizzatore</IonLabel>
      <IonInput
        name="organizer"
        value={newEvent?.organizer}
        onIonChange={(e) => (handleEventChange('organizer', e))}
      ></IonInput>

      <IonLabel position="stacked">Inizio</IonLabel>
      <IonDatetime
        value={newEvent.startTime.toISOString()}
        name="startTime"
        presentation="date-time"
        onIonChange={(e) => (handleEventChange('start', e))}
      ></IonDatetime>

      <IonLabel position="stacked">Fine</IonLabel>
      <IonDatetime
        name="endTime"
        value={newEvent.endTime.toISOString()}
        min={newEvent?.startTime.toISOString()}
        presentation="date-time"
        onIonChange={(e) => (handleEventChange('end', e))}
      ></IonDatetime>

      <IonButton onClick={handleAddEvent}>Aggiungi Evento</IonButton>

    </>
  );
  const checkEmptyfield = (e: Event): boolean => {
    if (e.title == '' || e.description == '' || e.organizer == '')
      return true; else return false;
  }
  const handleAddEvent = () => {
    console.log(newEvent)
    if (!checkEmptyfield(newEvent)) {
      addNewEvent(newEvent);
      // Optionally, you can reset the form after adding the event
      setNewEvent({
        id: '',
        title: '',
        description: '',
        organizer: '',
        startTime: new Date(),
        endTime: new Date(),
        participants: [],
      });
      setSelectedSegment('my');
      setcurrentDisplay('default');
    } else {
      showAlert("Nuovo Evento", "Non Lasciare campi vuoti");
    }
  };
  const handleCreateEvent = () => {
    setcurrentDisplay('newevent');
  }
  const DefaultDisplay = () => (
    <>
      <IonSegment mode='ios' value={selectedSegment} onIonChange={handleSegmentChange}>
        <IonSegmentButton value="all">
          <IonLabel>tutti gli eventi</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="my">
          <IonLabel>I miei eventi</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {/* IonList per visualizzare l'elenco degli eventi */}
      <IonList>
        {selectedSegment === 'all' && <AllEvents />}
        {selectedSegment === 'my' && <MyEventList />}
      </IonList>
      <IonButton expand="full" onClick={handleCreateEvent}>
        Create New Event
      </IonButton>
    </>
  );
  const addNewEvent = (e: Event) => {
    e.id = fakerIT.lorem.word();
    e.participants = [];
    events.push(e);
    myEvents.push(e);
    console.log(myEvents, newEvent)
  }
  const handleEventClick = (eventId: string) => {
    // Find the selected event
    const selectedEvent = events?.find((event) => event.id === eventId);
    // Check if the event is found
    if (selectedEvent) {
      // Navigate to the DettaglioEventi page with the selected event details
      history.push(`/app/evento/${eventId}`, { event: selectedEvent });
    }
  };
  useEffect(() => {
    setEvents(generateRandomEvents(Math.floor(Math.random() * 10) + 1));
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Eventi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {currentDisplay === 'default' && <DefaultDisplay />}
        {currentDisplay === 'newevent' && <AddEvent />}

        <IonAlert
          isOpen={showAlertState}
          onDidDismiss={() => { setShowAlertState(false); navigate }}
          header={'Eventi'}
          className='custom-alert'

          subHeader={alertSubHeader}
          message={alertMessage}
          buttons={[
            {
              text: 'OK',
              role: 'confirm',
              cssClass: 'custom-button',
              handler: () => {
                // Handle button click if needed
              }
            }
          ]}
          backdropDismiss={false}
        />
      </IonContent>

      <IonTabBar slot="bottom">
        <IonTabButton tab="eventi" href="/app/eventi">
          <IonIcon aria-hidden="true" icon={list} />
          <IonLabel>Eventi</IonLabel>
        </IonTabButton>
        <IonTabButton tab="inviti" href="/app/inviti">
          <IonIcon aria-hidden="true" icon={sendOutline} />
          <IonLabel>Inviti</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profilo" href="/app/profilo">
          <IonIcon aria-hidden="true" icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default Eventi;


