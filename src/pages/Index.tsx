
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mic, Pencil } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-note-text">Voice Notes</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Capture your thoughts easily with voice recordings or text notes
        </p>
        
        <div className="flex flex-col space-y-4 mb-8">
          <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Mic className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold">Voice Notes</h2>
              <p className="text-sm text-gray-500">Speak and we'll transcribe your notes</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Pencil className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold">Text Notes</h2>
              <p className="text-sm text-gray-500">Type and format your notes with ease</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/')} 
          className="px-8 py-6 text-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
