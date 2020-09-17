import React from 'react';
import './style.css';
import { useTabContent } from './utils/hooks';
import Team from './components/team';
import Fixture from './components/fixture';

function App() {
  const TabContent = useTabContent();

  if (!TabContent.content)
    TabContent.display(<Fixture TabContent={TabContent} />);

  return (
    <div id="container">
      <ul className="tabContainer">
        <li
          onClick={() =>
            TabContent.display(<Fixture TabContent={TabContent} />)
          }
        >
          Fixtures
        </li>
        <li
          onClick={() => TabContent.display(<Team TabContent={TabContent} />)}
        >
          Teams
        </li>
      </ul>

      <div>{TabContent.content}</div>
    </div>
  );
}

export default App;
