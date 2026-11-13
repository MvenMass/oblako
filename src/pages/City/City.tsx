import { useParams } from 'react-router-dom';
import { PageStub } from '../PageStub';

export default function City() {
  const { id = '' } = useParams();
  return <PageStub eyebrow="Направление" title="Город" accent={id} />;
}
