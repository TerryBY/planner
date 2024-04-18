import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonCard, IonCardContent, IonIcon, IonLabel, IonTabBar, IonTabButton, IonButton, IonDatetime, IonModal, IonCheckbox } from '@ionic/react';
import Event from '../../modelli/evento';
import Timeslot from '../../modelli/timelolt';
import { list, sendOutline, personCircleOutline, add } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

const DettaglioEvento: React.FC = () => {
  const [event, setEvent] = useState<Event>();
  const [timeSlots, setTimeSlots] = useState<Timeslot[]>([]);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | string[] | undefined>(undefined);
  const [selectAllDay, setSelectAllDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentSlide, setCurrentSlide] = useState(1);
  const handleAddTimeSlot = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectAllDay(true);
    setCurrentSlide(1);
    setSelectedTimeRange(undefined);
  };
  const handleTimeSelection = () => {
    console.log(selectedTimeRange);

    // Check if it's "Tutto il giorno" and an array
    if (selectAllDay) {
      // Create a time slot for each day in the array
      const newTimeSlots:Timeslot[] = selectedTimeRange?.map((dateString:any) => {
        const day = new Date(dateString);

        return {
          id: `${Date.now()}`,
          parentId: event?.id || '',
          startTime: day, // Assuming the entire day is available
          endTime: new Date(day.getTime() + 24 * 60 * 60 * 1000), // End of the day
          participant: 'New Participant', // You can customize this based on your requirements
          allDay: selectAllDay
        };
      });

      // Add the time slots to the state
      setTimeSlots((prevTimeSlots) => [...prevTimeSlots, ...newTimeSlots]);
      setShowModal(false);
    } else {
      // Handle the case when it's not "Tutto il giorno" and a single time range is selected
   
      const start = new Date(startTime);
      const end= new Date(endTime);

      // Ensure end time is after start time
      if (endTime <= startTime) {
        // Handle error, e.g., display a message to the user
        console.error('End time must be after start time');
        return;
      }

      // Create a time slot with specified start and end times
      const newTimeSlot: Timeslot = {
        id: `${Date.now()}`,
        parentId: event?.id || '',
        startTime:start,
        endTime:end,
        allDay:selectAllDay,
        participant: 'New Participant', // You can customize this based on your requirements
      };

      // Add the time slot to the state
      setTimeSlots((prevTimeSlots) => [...prevTimeSlots, newTimeSlot]);
      setShowModal(false);
    }
    handleModalClose();
  };
  const DateSlide = () => (
    <>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={handleModalClose}>Chiudi</IonButton>
        </IonButtons>
        <IonTitle>Seleziona la data</IonTitle>
      </IonToolbar>
      {/* Select Date */}
      <IonDatetime
        mode='ios'
        value={selectedTimeRange}
        min={event?.startTime.toISOString()}
        max={event?.endTime.toISOString()}
        presentation='date'
        onIonChange={(e:any) => setSelectedTimeRange(e.detail.value)}
        multiple={selectAllDay}
      ></IonDatetime>
      <IonCheckbox checked={selectAllDay} onIonChange={(e) => {setSelectAllDay(e.detail.checked);}} />
      <IonButton onClick={()=>{selectAllDay? handleTimeSelection(): setCurrentSlide(2)}}>{selectAllDay? 'Conferma': 'Avanti'}</IonButton>
    </>
  );
  
  const StartTimeSlide = () => (
    <>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={handleModalClose}>Chiudi</IonButton>
        </IonButtons>
        <IonTitle>Seleziona L'inizio</IonTitle>
      </IonToolbar>
      {/* Select Time Range */}
      <IonDatetime
        mode='ios'
        value={startTime}
        presentation='time'
        onIonChange={(e:any) => setStartTime(e.detail.value)}
      ></IonDatetime>
      <IonButton onClick={()=>{setCurrentSlide(1)}}>Indietro</IonButton>
      <IonButton  onClick={()=>{setCurrentSlide(3)}}>Avanti</IonButton>
    </>
  );
  
  const EndTimeSlide = () => (
    <>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={handleModalClose}>Chiudi</IonButton>
        </IonButtons>
        <IonTitle>Seleziona La fine</IonTitle>
      </IonToolbar>
      {/* Select Time Range */}
      <IonDatetime
        mode='ios'
        min={new Date(startTime).toISOString()}
        value={endTime}
        presentation='time'
        onIonChange={(e:any) => setEndTime(e.detail.value)}
      ></IonDatetime>
      <IonButton onClick={()=>{setCurrentSlide(1)}}>Indietro</IonButton>
      <IonButton  onClick={handleTimeSelection}>Conferma</IonButton>
    </>
  );



  useEffect(() => {
    setEvent(location.state?.event);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/eventi" />
          </IonButtons>
          <IonTitle>{event?.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Display event details within an IonCard */}
        <IonCard>
          <IonCardContent>
            <h2>{event?.title}</h2>
            <p>{`Organizer: ${event?.organizer}`}</p>
            <p>{`Start Time: ${event?.startTime}`}</p>
            <p>{`End Time: ${event?.endTime}`}</p>
            <IonButton onClick={handleAddTimeSlot} expand="full">
              <IonLabel>Aggiungi fascia oraria</IonLabel>
              <IonIcon slot="end" icon={add} />
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <IonLabel>
              <h3>Time Slots</h3>
              {timeSlots.length === 0 ? (
                <p>Non hai inserito il tuo slot di disponibilità.</p>
              ) : (
                timeSlots.map((timeSlot) => (
                  <p key={timeSlot.id}>
                    {`Start Time: ${timeSlot.startTime.toLocaleString()} | End Time: ${timeSlot.endTime.toLocaleString()} | Participant: ${timeSlot.participant}`}
                  </p>
                ))
              )}
            </IonLabel>
          </IonCardContent>
        </IonCard>
        <IonModal isOpen={showModal}>
      {currentSlide === 1 && <DateSlide  />}
      {currentSlide === 2 && <StartTimeSlide/>}
      {currentSlide === 3 && <EndTimeSlide />}
    </IonModal>
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

export default DettaglioEvento;
