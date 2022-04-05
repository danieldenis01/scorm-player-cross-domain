import './App.css';
import 'scorm-again';

const settings = {}

function App() {
  const scormRootFile = document.body.getAttribute('data-scorm-root')
  // eslint-disable-next-line no-undef
  window.API = new Scorm12API(settings)

  window.API.on("LMSInitialize", () => {
    const params = { type: "LMSInitialize" }
    window.top.postMessage(params, '*')
  })

  window.API.on("LMSSetValue.cmi.*", (CMIElement, value) => {
    const params = { type: "LMSSetValue.cmi.*", payload: [CMIElement, value] }
    window.top.postMessage(params, '*')
  })

  return (
    <iframe className="eic-scorm-frame" src={ scormRootFile } title="Escola IC"></iframe>
  );
}

export default App;
