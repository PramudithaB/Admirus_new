import EcosystemShowcasePage from '../EcosystemShowcasePage/EcosystemShowcasePage';
import { droneMahaththayaData } from '../../data/ecosystemData';

export default function DronePage() {
  return <EcosystemShowcasePage data={droneMahaththayaData} type="aerial" />;
}
