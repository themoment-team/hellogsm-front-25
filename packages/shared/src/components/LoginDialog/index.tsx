import { Button, LoginButton } from 'shared/components';
import { Dialog, DialogContent, DialogTrigger } from 'shared/components';
import { cn } from 'shared/lib/utils';

const LoginDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">로그인</Button>
      </DialogTrigger>
      <DialogContent className={cn('w-fit', 'p-0', '!rounded-[20px]')}>
        <div
          className={cn(
            'w-fit',
            'flex',
            'pt-8',
            'px-12',
            'pb-10',
            'flex-col',
            'items-center',
            'gap-8',
          )}
        >
          {/* <h1>현재는 로그인을 할 수 없습니다.</h1> */}
          <span className={cn('text-2xl', 'font-semibold', 'text-gray-900')}>로그인</span>
          <div className={cn('flex', 'flex-col', 'gap-3')}>
            <LoginButton variant="kakao">카카오로 시작하기</LoginButton>
            <LoginButton variant="google">Google 계정으로 시작하기</LoginButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
