import EcosystemShowcasePage from '../EcosystemShowcasePage/EcosystemShowcasePage';
import GlobalDeliveryMap from '../../components/GlobalDeliveryMap/GlobalDeliveryMap';
import { hiClothData } from '../../data/ecosystemData';

export default function HiClothPage() {
  return (
    <EcosystemShowcasePage
      data={hiClothData}
      type="apparel"
      extraContent={<GlobalDeliveryMap />}
    />
  );
}

