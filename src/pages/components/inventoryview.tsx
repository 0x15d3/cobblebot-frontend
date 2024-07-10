import { useEffect, useMemo, useRef, useState } from 'react';
import textures from './textures.json';


export interface SlotProps{
  slot:number;
  name:string;
  count:number;
}

interface InventoryViewProps {
  slots: SlotProps[];
}

function InventoryView({ slots }: InventoryViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);


  const slotToPos = useMemo((): { [key: number]: { x: number, y: number } } => ({
    // Crafting slots
    0: { x: 307, y: 55 },
    1: { x: 195, y: 35 },
    2: { x: 231, y: 35 },
    3: { x: 195, y: 71 },
    4: { x: 231, y: 71 },
  
    5: { x: 15, y: 15 }, // Helmet
    9: { x: 15, y: 167 }, // Inventory
    18: { x: 15, y: 203 }, // Inventory
    27: { x: 15, y: 239 }, // Inventory
    36: { x: 15, y: 283 }, // Tool bar
    45: { x: 153, y: 123 }, // Left hand
  }), []);
  
  // Add tool bar slots (36 - 44)
  for (let i = 36 + 1; i <= 44; i++) {
    slotToPos[i] = { x: slotToPos[i - 1].x + 36, y: slotToPos[i - 1].y };
  }
  
  // Add armor slots (5 - 8)
  for (let i = 5 + 1; i <= 8; i++) {
    slotToPos[i] = { x: slotToPos[i - 1].x, y: slotToPos[i - 1].y + 36 };
  }
  
  // Add inventory slots (9 - 35)
  for (let i = 9 + 1; i <= 17; i++) {
    slotToPos[i] = { x: slotToPos[i - 1].x + 36, y: slotToPos[i - 1].y };
  }
  for (let i = 18 + 1; i <= 26; i++) {
    slotToPos[i] = { x: slotToPos[i - 1].x + 36, y: slotToPos[i - 1].y };
  }
  for (let i = 27 + 1; i <= 35; i++) {
    slotToPos[i] = { x: slotToPos[i - 1].x + 36, y: slotToPos[i - 1].y };
  }


  const nameToTexture = useMemo((): { [key: string]: string } => {
    const data: { [key: string]: string } = {};
    textures.forEach(item => {
      if (item.name && item.texture) {
        data[item.name] = item.texture;
      }
    });
    return data;
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!context) {
      return;
    }
  
    const rect = canvas?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const clickedSlot = Object.keys(slotToPos).find(
      (slot) =>
        x >= slotToPos[slot].x &&
        x <= slotToPos[slot].x + 32 &&
        y >= slotToPos[slot].y &&
        y <= slotToPos[slot].y + 32
    );
  
    if (clickedSlot) {
      const slotIndex = slots.find(x => x.slot == parseInt(clickedSlot))
      if(!slotIndex) return;
      setSelectedItem(slotIndex.name);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) {
      return;
    }

    const bg = new Image();
    bg.src =
      '/inventory.png';
    bg.onload = () => {
      context.drawImage(bg, 0, 0);

      slots.forEach((slot) => {
        if (slot) {
          const item = slot;
          const pos = slotToPos[item.slot];
          const texture = nameToTexture[item.name];
          if (texture) {

            const itemImage = new Image();
            itemImage.src = texture;
            itemImage.onload = () => {
              context.imageSmoothingEnabled = false;
              context.drawImage(itemImage, pos.x, pos.y, 32, 32);

              if (item.count > 1) {
                context.font = '20px monospace';
                context.fillStyle = 'black';
                context.textAlign = 'end';
                context.fillText(item.count.toString(), pos.x + 32, pos.y + 31);
                context.fillStyle = 'white';
                context.fillText(item.count.toString(), pos.x + 32, pos.y + 30);
              }
            };
          }
        }
      });
    };

    // Handle mouse clicks
    canvas?.addEventListener('click', handleClick as any);

    return () => {
      canvas?.removeEventListener('click', handleClick as any);
    };
  }, [slots, slotToPos, nameToTexture]);

  return (
    <div>
      <canvas ref={canvasRef} width="352" height="332" />
      {selectedItem && <div>Seçilen Eşya: {selectedItem}</div>}
    </div>
  );
}

export default InventoryView;