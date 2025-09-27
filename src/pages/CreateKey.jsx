// import React, { useState } from 'react';
// import axios from '../api/client';

// export default function CreateKey() {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [price, setPrice] = useState(50);

//   const submit = async () => {
//     const fd = new FormData();
//     fd.append('file', file);
//     fd.append('title', title);
//     fd.append('price_credits', price);
//     const res = await axios.post('/host/upload', fd);
//     alert('uploaded: ' + res.data.uploadId);
//   };

//   return (
//     <div>
//       <h2>Upload Keys (one-per-line)</h2>
//       <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
//       <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
//       <input type="file" accept=".txt,.csv" onChange={e=>setFile(e.target.files[0])}/>
//       <button onClick={submit}>Upload</button>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Container, Stack, Typography, TextField, Card, CardContent, Button } from '@mui/material';
import api from '../api/client';

export default function CreateKey(){
  const [title,setTitle]=useState('');
  const [price,setPrice]=useState(50);
  const [file,setFile]=useState(null);

  const submit = async ()=>{
    if (!file) return alert('Choose a .txt or .csv file');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price_credits', price);
    fd.append('file', file);
    try{
      const { data } = await api.post('/host/upload', fd);
      alert(`Uploaded! id=${data?.uploadId || 'n/a'}`);
    }catch(e){
      console.error(e);
      alert('Upload failed');
    }
  };

  return (
    <Container sx={{py:4}}>
      <Stack spacing={2}>
        <Typography variant="h4" color="primary.main">Host: Upload Keys</Typography>
        <Card variant="elevated">
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Listing Title" value={title} onChange={e=>setTitle(e.target.value)} />
              <TextField type="number" label="Price (credits)" value={price} onChange={e=>setPrice(Number(e.target.value))} />
              <Button variant="outlined" component="label" color="primary">
                Choose .txt or .csv
                <input type="file" hidden accept=".txt,.csv" onChange={e=>setFile(e.target.files?.[0]||null)} />
              </Button>
              OR
              {/* Paste/Type keys here */}
              
              <input type="text" placeholder="Or paste keys here, one-per-line" style={{width:'100%',height:100,fontFamily:'monospace'}} onChange={e=>{
                const blob = new Blob([e.target.value], { type: 'text/plain' });
                const f = new File([blob], 'pasted-keys.txt', { type: 'text/plain' });
                setFile(f);
              }} />
              <div>Selected file: {file ? file.name : '(none)'}</div>
              <Button onClick={submit} variant="contained" color="secondary">Upload</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}