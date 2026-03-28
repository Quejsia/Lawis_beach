// ===== SPLASH =====
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('splash').classList.add('hide');
    document.getElementById('site').classList.add('show');
  },3000);
});

// ===== HERO SLIDESHOW =====
const slides=document.querySelectorAll('.hero-slide');
let cur=0;
setInterval(()=>{
  slides[cur].classList.remove('active');
  cur=(cur+1)%slides.length;
  slides[cur].classList.add('active');
},4500);

// ===== SCROLL REVEAL =====
const ro=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// ===== AUTH MODAL =====
const modal=document.getElementById('authModal');
const openAuth=()=>modal.classList.add('open');
const closeAuth=()=>modal.classList.remove('open');
document.getElementById('openAuth').addEventListener('click',e=>{e.preventDefault();openAuth()});
document.getElementById('openAuth2').addEventListener('click',e=>{e.preventDefault();switchTab('signup');openAuth()});
document.getElementById('openAuth3').addEventListener('click',e=>{e.preventDefault();switchTab('signup');openAuth()});
document.getElementById('closeModal').addEventListener('click',closeAuth);
modal.addEventListener('click',e=>{if(e.target===modal)closeAuth()});

function switchTab(t){
  document.getElementById('loginForm').style.display=t==='login'?'block':'none';
  document.getElementById('signupForm').style.display=t==='signup'?'block':'none';
  document.getElementById('tabLogin').className='tab-btn'+(t==='login'?' active':'');
  document.getElementById('tabSignup').className='tab-btn'+(t==='signup'?' active':'');
}
document.getElementById('tabLogin').addEventListener('click',()=>switchTab('login'));
document.getElementById('tabSignup').addEventListener('click',()=>switchTab('signup'));

// ===== PASSWORD =====
function togglePass(id,btn){
  const inp=document.getElementById(id);
  inp.type=inp.type==='password'?'text':'password';
  btn.textContent=inp.type==='password'?'👁':'🙈';
}
function updateStrength(){
  const v=document.getElementById('signupPass').value;
  let score=0;
  if(v.length>=8)score++;
  if(/[A-Z]/.test(v))score++;
  if(/[0-9]/.test(v))score++;
  if(/[^A-Za-z0-9]/.test(v))score++;
  const fill=document.getElementById('strengthFill');
  const label=document.getElementById('strengthLabel');
  fill.className='strength-fill strength-'+score;
  const labels=['Enter a password','Weak — try longer','Fair — add numbers','Good — add symbols','Strong password! ✓'];
  label.textContent=labels[score];
  label.style.color=score===4?'#2ecc71':score===3?'#f1c40f':score===2?'#e67e22':'#e74c3c';
  checkMatch();
}
function checkMatch(){
  const p1=document.getElementById('signupPass').value;
  const p2=document.getElementById('signupPass2').value;
  const hint=document.getElementById('matchHint');
  if(p2.length===0){hint.textContent='Passwords must match';hint.className='form-hint';return}
  if(p1===p2){hint.textContent='✓ Passwords match';hint.className='form-hint valid';}
  else{hint.textContent='✗ Passwords do not match';hint.style.color='#e74c3c';}
}
function checkSignup(){}

// ===== AUTH HANDLERS =====
function handleLogin(){
  const email=document.getElementById('loginEmail').value;
  const pass=document.getElementById('loginPass').value;
  if(!email||!pass){showToast('Please fill in all fields.');return;}
  if(!email.includes('@')){showToast('Please enter a valid email.');return;}
  closeAuth();
  showToast('Welcome back to Lawis Beach! 🌊');
}
function handleSignup(){
  const name=document.getElementById('signupName').value;
  const email=document.getElementById('signupEmail').value;
  const p1=document.getElementById('signupPass').value;
  const p2=document.getElementById('signupPass2').value;
  if(!name||!email||!p1||!p2){showToast('Please fill in all fields.');return;}
  if(!email.includes('@')){showToast('Please enter a valid email.');return;}
  if(p1.length<6){showToast('Password must be at least 6 characters.');return;}
  if(p1!==p2){showToast('Passwords do not match.');return;}
  closeAuth();
  showToast('Welcome to Lawis Beach, '+name.split(' ')[0]+'! 🎉');
}

// ===== GALLERY / LIGHTBOX =====
const galleryImgs=[];
document.querySelectorAll('.gallery-item img').forEach((img,i)=>{
  galleryImgs.push(img.src);
  img.parentElement.addEventListener('click',()=>openLightbox(i));
});
let lbIdx=0;
function openLightbox(i){
  lbIdx=i;
  document.getElementById('lightboxImg').src=galleryImgs[lbIdx];
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open')}
function lightboxNav(d){
  lbIdx=(lbIdx+d+galleryImgs.length)%galleryImgs.length;
  document.getElementById('lightboxImg').src=galleryImgs[lbIdx];
}
document.getElementById('lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox()});

// ===== UPLOAD =====
const uploadZone=document.getElementById('uploadZone');
const uploadInput=document.getElementById('uploadInput');
const communityGallery=document.getElementById('community-gallery');
let communityPhotos=[];

uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('drag')});
uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('drag'));
uploadZone.addEventListener('drop',e=>{
  e.preventDefault();uploadZone.classList.remove('drag');
  handleFiles(e.dataTransfer.files);
});
uploadInput.addEventListener('change',e=>handleFiles(e.target.files));

function handleFiles(files){
  Array.from(files).forEach(file=>{
    if(!file.type.startsWith('image/'))return;
    const reader=new FileReader();
    reader.onload=e=>{
      addCommunityPhoto(e.target.result);
      showToast('📸 Photo shared with the community!');
    };
    reader.readAsDataURL(file);
  });
}
function addCommunityPhoto(src){
  if(communityPhotos.length===0){communityGallery.innerHTML='';}
  communityPhotos.push(src);
  galleryImgs.push(src);
  const div=document.createElement('div');
  div.className='community-photo';
  div.innerHTML=`<img src="${src}" alt="Community photo"><span class="photo-badge">New ✨</span>`;
  const idx=galleryImgs.length-1;
  div.addEventListener('click',()=>openLightbox(idx));
  communityGallery.appendChild(div);
  setTimeout(()=>{div.querySelector('.photo-badge').style.display='none'},5000);
}

// ===== TOAST =====
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}
</script>