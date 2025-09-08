import { OneseoStatusType, SexEnum } from 'types';

import { cn } from 'shared/lib/utils';
const thStyle = 'border border-black bg-[#e9e9e9] ';
const tdStyle = 'border border-black ';

const PersonalInfoTable = ({ oneseo }: OneseoStatusType) => {
  return (
    <table className={cn('w-full', 'border-collapse', 'text-center', 'text-[1.2vh]')}>
      <thead>
        <tr>
          <th className={thStyle + 'w-[3%] border-l-0'} rowSpan={8}>
            인적사항
          </th>
        </tr>
        <tr>
          <th className={thStyle + 'w-[3%]'} rowSpan={3}>
            지원자
          </th>
          <th className={thStyle}>성 명</th>
          <td className={tdStyle}>{oneseo.privacyDetail.name}</td>
          <th className={thStyle + 'w-[3%] leading-tight'}>성별</th>
          <td className={tdStyle}>{SexEnum[oneseo.privacyDetail.sex ?? 'MALE']}</td>
          <th className={thStyle}>생년월일</th>
          <td className={tdStyle}>{oneseo.privacyDetail.birth}</td>
          <td rowSpan={6} className={tdStyle + 'h-[4cm] w-[3cm]'}>
            <img
              src={oneseo.privacyDetail.profileImg}
              alt="증명사진"
              className={cn('h-[4cm]', 'w-[3cm]')}
            />
          </td>
        </tr>
        <tr>
          <th className={thStyle}>주 소</th>
          <td className={tdStyle} colSpan={5}>
            {oneseo.privacyDetail.address} {oneseo.privacyDetail.detailAddress}
          </td>
        </tr>
        <tr>
          <th className={thStyle}>핸드폰</th>
          <td colSpan={5} className={tdStyle}>
            {oneseo.privacyDetail.phoneNumber}
          </td>
        </tr>
        <tr>
          <th className={thStyle + 'w-[3%]'} rowSpan={2}>
            보호자
          </th>
          <th className={thStyle}>성 명</th>
          <td className={tdStyle} colSpan={1}>
            {oneseo.privacyDetail.guardianName}
          </td>
          <th className={thStyle + 'leading-none'} colSpan={2}>
            지원자와의
            <br />
            관계
          </th>
          <td className={tdStyle} colSpan={2}>
            지원자 {oneseo.privacyDetail.name}의 {oneseo.privacyDetail.relationshipWithGuardian}
          </td>
        </tr>
        <tr>
          <th className={thStyle}>핸드폰</th>
          <td className={tdStyle} colSpan={5}>
            {oneseo.privacyDetail.guardianPhoneNumber}
          </td>
        </tr>
        <tr>
          <th className={thStyle} colSpan={3} rowSpan={6}>
            원서작성자(담임) 성명
          </th>
          <td
            colSpan={2}
            className={cn([
              tdStyle,
              'text-end',
              oneseo.privacyDetail.graduationType !== 'CANDIDATE' && [
                'bg-slash',
                'bg-contain',
                'bg-no-repeat',
              ],
            ])}
            rowSpan={3}
          >
            {oneseo.privacyDetail.graduationType === 'CANDIDATE' && '(인)'}
          </td>
          <th className={thStyle}>연락처</th>
          {oneseo.privacyDetail.graduationType === 'CANDIDATE' ? (
            <td className={cn('border-b', 'border-black')}>
              {oneseo.privacyDetail.schoolTeacherPhoneNumber}
            </td>
          ) : (
            <td className={cn([tdStyle, 'bg-slash', 'bg-contain', 'bg-no-repeat'])} />
          )}
        </tr>
      </thead>
    </table>
  );
};

export default PersonalInfoTable;
