import React, { useState } from 'react';

const Try = () => {
 


  return (
    <div      className="wrap justify-content-center align-items-center"
 >
      <form style={{margin:"30%"}}>
        <input
          type="file"
          accept="image/*"
          
        />
        <button>Submit</button>

      </form>
    </div>
  );
};

export default Try;
