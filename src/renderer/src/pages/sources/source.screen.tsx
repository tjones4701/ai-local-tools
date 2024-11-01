import { RouteElement } from '@renderer/app-router';
import ContainerHeader from '@renderer/components/container/ContainerHeader';
import ContainerSection from '@renderer/components/container/ContainerSection';
import Detail from '@renderer/components/detail';
import { Page } from '@renderer/components/page';
import { ClientSource, useSource } from '@renderer/lib/data/source.client';
import FEInput from '@renderer/quick-form/inputs/fe-input';
import QuickForm from '@renderer/quick-form/QuickForm';
import { SourceCards } from '../source-collections/source-cards';
import { SourcePartCards } from './source-part-cards';

export const SourceView: RouteElement = ({ params }) => {
  const sourceData = useSource(params?.id);

  const source = sourceData?.value;

  if (source == null) {
    return <div>Source not found</div>;
  }

  const handleSubmit = async (newValue: ClientSource) => {
    await sourceData.update(newValue);
    sourceData.fetch();
  };

  const title = source.name || 'New Source';
  let breadcrumbHref = '/source-collections';
  if (sourceData?.value?.source_collection_id != null) {
    breadcrumbHref = `/source-collections/${sourceData.value.source_collection_id}`;
  }
  return (
    <Page label={title} breadcrumbs={[{ href: breadcrumbHref, label: 'Source Collection' }]}>
      <ContainerSection>
        <QuickForm disabled={sourceData.loading} onSubmit={handleSubmit} defaultValues={source}>
          <FEInput label="Name" name="name" required />
          <FEInput label="Description" name="description" />
          <FEInput label="URI" name="uri" />
          <FEInput label="Source Type" readOnly name="source_type" />
          <FEInput label="Tags" name="tags" />
          <Detail label="Last Modified" type="date">
            {source.modified_at}
          </Detail>
        </QuickForm>
      </ContainerSection>
      <ContainerHeader>Child Sources</ContainerHeader>
      <ContainerSection>
        {source.source_collection_id != null && (
          <SourceCards collectionId={source.source_collection_id} parentId={source.id} />
        )}
      </ContainerSection>

      <ContainerHeader>Source Parts</ContainerHeader>
      <ContainerSection>
        {source.source_collection_id != null && <SourcePartCards sourceId={source.id} />}
      </ContainerSection>
    </Page>
  );
};
