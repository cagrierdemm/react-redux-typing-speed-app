import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { useEffect, useState } from 'react';
import { decrementTime, resetTime, correctWord, wrongWord, incrementKeyCount, calculateDks } from './redux/speedSlice';

var i = 0;

function App() {
  const words = useSelector((state) => state.word);
  const [isActive, setIsActive] = useState(false);
  const time = useSelector((state) => state.time);
  const keyCount = useSelector((state) => state.keyCount);
  const dks = useSelector((state) => state.dks);
  const correct = useSelector((state) => state.correct);
  const wrong = useSelector((state) => state.false);
  const [modalVisible, setModalVisible] = useState(false);
  const wordStatus = useSelector((state) => state.wordStatus);
  const [targetWordRef, setTargetWordRef] = useState(null);
  const [lang, setLang] = useState('TR');
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isActive && time > 0) {
      const intervalId = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isActive, dispatch, time]);

  const handleReset = () => {
    dispatch(resetTime());
    i = 0;
    setIsActive(false);
    setInputValue('');
  }

  const handleChange = (e) => {
    if (time > 0) {
      e.preventDefault();
      setIsActive(true);
      const value = e.target.value;
      setInputValue(value);

      if (value.includes(' ')) {
        if (lang === 'TR' ? value.slice(0, -1) === words[i].turkish : value.slice(0, -1) === words[i].english) {
          dispatch(correctWord(i));
          dispatch(incrementKeyCount(words[i].turkish.length + 1));
        }
        if (lang === 'TR' ? value.slice(0, -1) !== words[i].turkish : value.slice(0, -1) !== words[i].english) {
          dispatch(wrongWord(i));
        }
        i++;
        setInputValue('');
      }
    }
  }

  useEffect(() => {
    if (time === 0) {
      setModalVisible(true);
      dispatch(calculateDks())
    }
  }, [time, dispatch]);

  const closeModal = () => {
    setModalVisible(false);
  }

  useEffect(() => {
    if (targetWordRef) {
      targetWordRef.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetWordRef]);

  const langChange = (e) => {
    setLang(e.target.value);
    handleReset();
  }

  return (
    <div className='container'>
      <div className='row col-md-8 col-12 align-items-center mx-auto'>
        <div className='row mx-auto text-center lightBox p-2 d-flex justify-content-center align-items-center'>
          <div className='col-3 col-md-2'>
            <select className='rounded-3' onChange={langChange}>
              <option value='TR'>Türkçe</option>
              <option value='EN'>English</option>
            </select>
          </div>
          <div className='col-6 col-md-8'>
            <h3 className='p-0  m-0'>{lang === 'TR' ? 'Yazma Hızı Testi' : 'Typing Speed'}</h3>
          </div>
          <div className='col-3 col-md-2'>
            <a href='https://github.com/cagrierdemm'><img src='./github.png' className='float-end lightLogo' alt='Github Logo' width={30} /></a>
            <a href='https://www.linkedin.com/in/cagrierdemm/'><img src='./linkedin.png' className='lightLogo' alt='Linkedin Logo' width={30} /></a>
          </div>
        </div>
      </div>

      <div className='row col-md-8 col-12 align-items-center mx-auto lightBox p-4 mt-5 mb-5 '>
        <div className='bg-white border-0 rounded-3 mt-3' style={{ maxHeight: "180px", overflowY: "hidden" }}>
          {words.map((word, key) => (
            <span key={key} ref={key === i ? setTargetWordRef : null} className={`p-1 pt-4 fs-4 mb-2`}><span className={`p-1 text-${wordStatus[key]} ${key === i && 'bg-secondary-subtle'}`}>{lang === 'TR' ? word.turkish : word.english}</span></span>
          ))}
        </div>
        <div className='text-center'>
          <input className='mt-4 py-2 px-3 rounded-2 border-0' type='text' value={inputValue} onChange={handleChange}></input>
          <span className='mx-2 bg-dark rounded-2 border-0  text-white p-2 mrg'>{time}</span>
          <button className='me-2 p-2 rounded-2 border-0 text-white hover mrg' onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
          </button></div>
      </div>


      {modalVisible && (
        <div className="modal" id='exampleModal' tabindex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} data-bs-target="#exampleModal">
          <div className="modal-dialog modal-dialog-centered text-center">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{lang === 'TR' ? 'Sonuç' : 'Result'}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <h1><b>{Math.round(dks)}</b> <span className='fw-light'>{lang === 'TR' ? 'DKS' : 'WPM'}</span></h1>
                <h6 className='mt-4'>{lang === 'TR' ? 'Tuş Vuruşu: ' : 'Keystrokes: '}<span className='fw-bold'>{keyCount}</span></h6>
                <h6 className=''>{lang === 'TR' ? 'Doğru Kelime: ' : 'Correct Words: '}<span className='text-success fw-bold'>{correct}</span></h6>
                <h6>{lang === 'TR' ? 'Yanlış Kelime: ' : 'Wrong Words: '}<span className='text-danger fw-bold'>{wrong}</span></h6>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={closeModal}>{lang === 'TR' ? 'Kapat' : 'Close'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default App;
