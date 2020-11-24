import React from 'react';

import { REPORT_TYPE_ENUM } from '../../../../../../common/enums';
import MembersReportItem from './MembersReportItem';
import SalesReportItem from './SalesReportItem';

const ReportMap = {
  [REPORT_TYPE_ENUM.MEMBERS]: MembersReportItem,
  [REPORT_TYPE_ENUM.SALES]: SalesReportItem,
};

export default function ReportItemFactory(props) {
  const { reportId, update, metadata, reportType } = props;
  const Report = ReportMap[reportType];
  if (!Report) {
    /* eslint-disable-next-line */
    console.error(`${reportType} is not supported in ItemFactory`);
    return <></>;
  }
  return (
    <Report reportId={reportId} update={update} metadata={metadata} />
  );
}
