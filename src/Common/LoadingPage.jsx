function LoadingPage() {
    return (
      <div
        className="flex items-center justify-center h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/src/assets/vecteezy_abstract-orange-wavy-background-orange-background-with_35768911.jpg')",
        }}
      >
         <div className="w-14 h-14 border-8 border-orange-500 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  export default LoadingPage;
  