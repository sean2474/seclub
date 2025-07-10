import { LucideProps } from 'lucide-react';
import { Fragment } from 'react';

type Feature = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  value: string;
};

export function RoomFeatures({ features }: { features: Feature[] }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start max-w-6xl p-5 m-auto">
      {features.map(({ icon: Icon, label, value }, idx) => (
        <Fragment key={label}>
          {/* 구분선 */}
          {idx !== 0 && (
            <div className="w-full md:w-px h-px md:h-12 bg-gray-400/50 self-center" />
          )}
          <div className="flex items-center md:justify-center md:flex-col h-20 md:h-auto w-full md:w-1/5">
            <Icon size={40} strokeWidth={1} className='ml-2 md:ml-0' />
            <div className='flex items-start md:items-center md:justify-center flex-col ml-5 md:ml-0'>
              <div>{label}</div>
              <strong>{value}</strong>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}