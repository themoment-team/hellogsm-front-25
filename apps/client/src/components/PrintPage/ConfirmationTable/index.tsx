import { cn } from 'shared/lib/utils';

const ConfirmationTable = () => {
  return (
    <>
      <table
        className={cn(
          'mx-auto',
          'mt-[1.5vh]',
          'w-[80%]',
          'border-collapse',
          'border',
          'text-[1vh]',
        )}
      >
        <thead>
          <tr>
            <th
              className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'font-bold')}
              colSpan={4}
            >
              입력자 확인
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'font-bold')}>
              담임교사
            </th>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
            <th className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'font-bold')}>
              지원자
            </th>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
          </tr>
        </tbody>
      </table>
      <table
        className={cn(
          'mx-auto',
          'mt-[1.5vh]',
          'w-[80%]',
          'border-collapse',
          'border',
          'text-[1vh]',
        )}
      >
        <thead>
          <tr>
            <th
              className={cn(
                'border',
                'border-black',
                'bg-gray-200',
                'p-[0.3vh]',
                'font-bold',
                'w-[50%]',
              )}
              rowSpan={2}
            >
              광주소프트웨어마이스터고 접수자 확인
            </th>
            <th className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'font-bold')}>
              1차
            </th>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
          </tr>
          <tr>
            <th className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'font-bold')}>
              2차
            </th>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default ConfirmationTable;
