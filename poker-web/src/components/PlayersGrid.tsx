import type { RoomState } from '../types/RoomState';

export default function PlayersGrid({
  room, shouldFlipCards,
}: {
  room: RoomState;
  shouldFlipCards: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Object.entries(room.players || {}).map(([id, p]) => {
        const voted = id in (room.votes || {});
        const val = room.votes?.[id];
        const isSpectator = p.observer;
        
        return (
          <div key={id}
               className={`aspect-[2.5/3.5] rounded-lg border-2 transition-all duration-700 shadow-lg ${
                 isSpectator
                   ? 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500'
                   : voted 
                     ? shouldFlipCards 
                       ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500' 
                       : 'bg-gradient-to-br from-green-600 to-green-700 border-green-500'
                     : 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500'
               }`}
               style={{ 
                 transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', 
                 transformStyle: 'preserve-3d' 
               }}>
            <div className="h-full flex flex-col items-center justify-center p-1"
                 style={{ 
                   transform: shouldFlipCards ? 'rotateY(180deg)' : 'rotateY(0deg)', 
                   backfaceVisibility: 'hidden' 
                 }}>
              <div className="text-xs font-medium text-center mb-1 text-white flex items-center gap-1">
                <span className="truncate max-w-full">{p.name}</span>
                {isSpectator && (
                  <span className="text-xs bg-purple-500 text-white px-1 rounded-full flex-shrink-0">
                    👁
                  </span>
                )}
              </div>
              {isSpectator ? (
                <div className="text-xs text-purple-200">Spectator</div>
              ) : voted ? (
                <div className={`text-lg font-bold ${shouldFlipCards ? 'text-white' : 'text-white'}`}>
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