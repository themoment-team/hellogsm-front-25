import { Character } from 'shared/assets';
import { cn } from 'shared/lib/utils';

const ComputerRecommendedPage = () => (
  <div
    className={cn('flex', 'mdx:hidden', 'h-[calc(100vh-4.625rem)]', 'flex-col', 'justify-center')}
  >
    <div className={cn('flex', 'flex-col', 'items-center', 'gap-7')}>
      <Character />
      <h1 className={cn('text-center', 'text-gray-500', 'text-[1.25rem]/[1.75rem]', 'font-normal')}>
        원활한 원서접수를 위하여
        <br />
        <a className="text-blue-600"> PC(전체 화면 모드)</a>로 접속해 주시기 바랍니다.
      </h1>
    </div>
  </div>
);

export default ComputerRecommendedPage;
