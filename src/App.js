import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader'
import './App.css';
import 'scorm-again';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scormRootFile: document.body.getAttribute('data-scorm-root'),
      spinnerColor: '#333333',
      isReady: false
    }

    window.addEventListener('message', ({ data }) => {
      if (data.type === 'ScormInitialize') {
        this.initScorm(data.payload)
      }
    })
  }

  render() {
    const { isReady, scormRootFile, spinnerColor } = this.state

    return (
      <div className="app">
        {(function() {
          if (isReady) {
            return <iframe className = "eic-scorm-frame" src = { scormRootFile } title="Scorm Content"></iframe>
          } else {
            return <div className= "spinner" >
              <ClipLoader color={ spinnerColor } loading={ true } size={ 45 } />
            </div>
          }
        })()}
      </div>
    );
  }

  initScorm(settings) {
    if (this.state.isReady) return

    // eslint-disable-next-line no-undef
    window.API = new Scorm12API({ logLevel: 5, selfReportSessionTime: true })
    window.API.loadFromJSON(settings)

    this.setState({ isReady: true })

    window.API.on("LMSInitialize", () => {
      const params = { type: "LMSInitialize" }
      window.top.postMessage(params, '*')
    })

    window.API.on("LMSSetValue.cmi.*", (CMIElement, value) => {
      const params = { type: "LMSSetValue.cmi.*", payload: [CMIElement, value] }
      window.top.postMessage(params, '*')
    })
  }
}

export default App;
