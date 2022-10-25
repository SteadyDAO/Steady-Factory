import MergeTypeIcon from '@mui/icons-material/MergeType';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const RecentActivity = () => {
  return (
    <div className="RecentActivityContainer">
      <div className="RecentActivityHeaderContainer">
        <span className="RecentActivityHeaderTitle">Recent Activity</span>
      </div>
      <div className="RecentActivityItemsContainer">
        <div className="RecentActivityItemContainer">
          <CallSplitIcon className="RecentActivityItemIcon" fontSize="inherit" />
          <div className="RecentActivityItemInfoContainer">
            <span className="RecentActivityItemTitle">Split 10 ETH</span>
            <div className="RecentActivityItemInfoDetailsContainer">
              <span className="RecentActivityItemInfoTime">10 Oct 2022</span>
              <span className="RecentActivityItemInfoAddress">0x012a3fda37649945Cc72D725168FcB57A469bA6A</span>
              <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" />
            </div>
          </div>
        </div>
        <div className="RecentActivityItemContainer">
          <MergeTypeIcon className="RecentActivityItemIcon" fontSize="inherit" />
          <div className="RecentActivityItemInfoContainer">
            <span className="RecentActivityItemTitle">Merged 1 Leveraged NFT + 2500 sETH</span>
            <div className="RecentActivityItemInfoDetailsContainer">
              <span className="RecentActivityItemInfoTime">10 Oct 2022</span>
              <span className="RecentActivityItemInfoAddress">0x012a3fda37649945Cc72D725168FcB57A469bA6A</span>
              <OpenInNewIcon className="RecentActivityItemInfoIcon" fontSize="inherit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
