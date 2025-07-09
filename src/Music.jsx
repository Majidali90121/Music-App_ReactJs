import { useRef, useState, useEffect } from "react";
import './Music.css'
function Music() {
  const [song, setSong] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(null);
  const audioRef = useRef(null); 
 
  useEffect(() => {
    setLoading(true);
    fetch("https://itunes.apple.com/search?term=trending&entity=song&limit=100")
      .then(res => res.json())
      .then(data => {
        setSong(data.results);
        setLoading(false);
      });
  }, []);

  function handleSearch() {
    if (!search) return;
    setLoading(true);
    fetch(`https://itunes.apple.com/search?term=${search}&entity=song&limit=10`)
      .then(res => res.json())
      .then(data => {
        setSong(data.results); 
        setLoading(false);
      });
  }

 
  function handlePlay(previewUrl) {
    if (current === previewUrl && playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setCurrent(previewUrl);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setPlaying(true);
        }
      }, 100);
    }
  }

  return (
    <>
      <h1>Music App</h1>

      <input
        type="text"
        placeholder="Search music..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch} className="Search">Search</button>
   <div className="center">
      {loading ? (
        <div className="Loader"></div>
      ) : (
        song.map((songItem) => (
            
           <div key={songItem.trackId} >
            <img src={songItem.artworkUrl100} alt={songItem.trackName} />
            <p className="p">{songItem.trackName} - {songItem.artistName}</p>
            <button onClick={() => handlePlay(songItem.previewUrl)} className="button">
              {current === songItem.previewUrl && playing ? 'Pause ⏸️' : 'Play ▶️'}
            </button>
          </div>
        ))
      )}

      {current && (
        <audio
        
          ref={audioRef}
          src={current}
          onEnded={() => setPlaying(false)}
        />
      )}
      </div>
    </>
  );
}

export default Music;
