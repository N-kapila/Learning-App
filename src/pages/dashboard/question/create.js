// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { PaperMainDataNewPostForm } from '../../../sections/@dashboard/paper';

// ----------------------------------------------------------------------

QuestionCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function QuestionCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Question: Create">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: 'New Post' },
          ]}
        />
        {/* //TODO 
            // select paper grade
            // paper type -> model , term,
            // Exam -> if model
            // Term if available
            // Subject
            // Chapter
            // Add a sub chapter - nested
        */}
        <PaperMainDataNewPostForm />
      </Container>
    </Page>
  );
}
