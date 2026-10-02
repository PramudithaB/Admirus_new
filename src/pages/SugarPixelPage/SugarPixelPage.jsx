import EcosystemShowcasePage from '../EcosystemShowcasePage/EcosystemShowcasePage';
import { sugarPixelData } from '../../data/ecosystemData';

export default function SugarPixelPage() {
  return <EcosystemShowcasePage data={sugarPixelData} type="studio" />;
}
