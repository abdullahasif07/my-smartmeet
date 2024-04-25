import { Button } from '@/components/ui/button';
import { Eraser, LogOut, Pencil } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate, useSearchParams } from 'react-router-dom';



const CanvasBoard = () => {
  const [searchParams] = useSearchParams();
  const channelName = searchParams.get('channelName');
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState('draw');
  const [lineWidth, setLineWidth] = useState(5);

  const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = drawingMode === 'draw' ? 'black' : 'white';
      ctx.lineCap = 'round';
    }
  }, [lineWidth, drawingMode]);

  return (
    <div className='flex flex-col items-center w-full h-full gap-2'>
      <canvas
        ref={canvasRef}
        className="bg-white rounded"
        width={1000}
        height={515}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex items-center justify-between gap-8 bg-black max-w-md w-full py-4 px-12 rounded">
        <div className='flex gap-2'>
          <Button onClick={() => setDrawingMode('draw')}
            variant={
              drawingMode === 'draw' ? 'default' : 'secondary'
            }
          >
            <Pencil size={24}
            />
          </Button>
          <Button
            variant={
              drawingMode === 'erase' ? 'default' : 'secondary'
            }
            onClick={() => setDrawingMode('erase')}>
            <Eraser size={24} />
          </Button>
          <Select
            defaultValue={lineWidth.toString()}
            onValueChange={(value) => setLineWidth(parseInt(value, 10))}
          >
            <SelectTrigger className='w-28'>
              <SelectValue placeholder="Change line width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1px</SelectItem>
              <SelectItem value="5">5px</SelectItem>
              <SelectItem value="10">10px</SelectItem>
              <SelectItem value="15">15px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant='destructive'
          onClick={() => navigate('/via/' + channelName)}
        >
          <LogOut size={24} />
        </Button>
      </div>
    </div >
  );
};


const WhiteboardScreen = () => {
  return (
    <div className='min-h-screen flex flex-col items-center gap-4 py-4 px-20 bg-gradient-to-tr 
    from-violet-400 via-pink-300 to-rose-200'>
      <h1 className='text-5xl font-semibold'>Whiteboard</h1>
      <CanvasBoard />
    </div>
  );
}

export default WhiteboardScreen;
