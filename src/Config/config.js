// change function request to add a real server to upload a photo
// instead of a mockup with timeout
export const request = (that,data) =>{
  let message;
  if (Math.random()<0.5){
      message = 'Photo was uploaded successfully';
  }
  else{
      message = 'Failed to upload. Please try again!';
  }
  setTimeout(()=>that.openDialog(message),1 * 1000);
}
