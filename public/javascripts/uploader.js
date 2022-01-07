var al = 0;

function progressBarSim() {
    const bar = document.getElementById('progressBar');
    const status = document.getElementById('status');
 
    status.innerHTML = al+'%';
    bar.style.width = al+'%';
    al++;

    const sim = setTimeout("progressBarSim("+al+")", 200);
    if(al == 100) {
      status.innerHTML = "100%";
      bar.style.width = 100+'%';
      clearTimeout(sim);
      bar.style.width = '0';
      document.getElementById('finalMessage').innerHTML = "Upload is complete! Please wait until you are redirected to your newly created spot.";
    }
  };


const mybtn = document.getElementById('submit-btn');

mybtn.onclick = progressBarSim;
