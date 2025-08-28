import type { RoomState } from '../types/RoomState';

export default function PlayersGrid({
  room, shouldFlipCards,
}: {
  room: RoomState;
  shouldFlipCards: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(room.players || {}).map(([id, p]) => {
        const voted = id in (room.votes || {});
        const val = room.votes?.[id];
        return (
          <div key={id}
               className={`aspect-[4/3] rounded-xl border-2 transition-all duration-700 shadow-lg ${
                 voted 
                   ? shouldFlipCards 
                     ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500' 
                     : 'bg-gradient-to-br from-green-600 to-green-700 border-green-500'
                   : 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500'
               }`}
               style={{ 
                 transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', 
                 transformStyle: 'preserve-3d' 
               }}>
            <div className="h-full flex flex-col items-center justify-center p-2"
                 style={{ 
                   transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', 
                   backfaceVisibility: 'hidden' 
                 }}>
              <div className="text-xs font-medium text-center mb-1 text-white">{p.name}</div>
              {voted ? (
                <div className={`text-xl font-bold ${shouldFlipCards ? 'text-white' : 'text-white'}`}>
                  {shouldFlipCards ? (val ?? '?') : '✓'}
                </div>
              ) : (
                <div className="text-xs text-slate-300">Waiting...</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}