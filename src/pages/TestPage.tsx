import { Layout } from "../components/Layout/Layout.tsx";
import { PanelContainer } from "../components/PanelContainer/PanelContainer.tsx";
import { Panel } from "../components/Panel/Panel.tsx";

export function TestPage() {
  return (
    <Layout>
      <PanelContainer>
        <Panel>
          <h1>Test Page</h1>
          <p>Welcome to the Test Page!</p>
        </Panel>
        <Panel>
          <p>This is a test page for development purposes.</p>
        </Panel>
      </PanelContainer>
    </Layout>
  );
}
