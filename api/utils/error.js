export const errorHandler = (statusCode, message)=>{
  const error=new Error()
  error.statusCode=statusCode
  error.message=message
  return error;
}

// this can be used when we wantedly want to show some error like password should be 10 digits etc.