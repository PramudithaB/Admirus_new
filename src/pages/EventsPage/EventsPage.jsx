import EcosystemShowcasePage from '../EcosystemShowcasePage/EcosystemShowcasePage';
import { eventsAdmirusData } from '../../data/ecosystemData';

export default function EventsPage() {
  return <EcosystemShowcasePage data={eventsAdmirusData} type="events" />;
}
