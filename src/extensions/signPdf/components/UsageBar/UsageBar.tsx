import { Icon, MessageBar, MessageBarType } from "office-ui-fabric-react";
import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

type Props = {
  willExceedLimit: boolean;
};

const UsageBar = ({ willExceedLimit }: Props): React.ReactElement => {
  const { files, planInfo } = useScreenSetup();
  const currentUsagePercentage =
    ((planInfo?.documents_used ?? 0) / (planInfo?.documents_total ?? 1)) * 100;
  const [showContactAdmin, setShowContactAdmin] = React.useState(false);

  const handleSubscriptionLogin = () => {
    if (planInfo?.role === "admin") {
      const appServerBaseUrl = process.env.APP_SERVER_BASE_URL;
      window.open(`${appServerBaseUrl}/admin`, "_blank");
    } else {
      setShowContactAdmin(true);
    }
  };
  return (
    <>
      <div className="tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] tw-bg-white tw-p-6">
        <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between">
          <div>
            <h4 className="tw-font-semibold tw-text-[rgb(32,31,30)]">
              Subscription Status
            </h4>
            <p className="tw-mt-1 tw-text-[rgb(96,94,92)] tw-text-sm">
              {planInfo?.current_plan} Plan
            </p>
          </div>
          {planInfo?.current_plan !== "free" ? (
            <div className="tw-flex tw-items-center tw-gap-2 tw-rounded-sm tw-bg-[rgb(237,235,233)] tw-px-3 tw-py-1.5">
              <Icon
                iconName="Completed"
                styles={{ root: { color: "rgb(16, 124, 16)", fontSize: 16 } }}
              />
              <span className="tw-font-medium tw-text-[rgb(16,124,16)] tw-text-sm">
                Active
              </span>
            </div>
          ) : (
            <button
              onClick={handleSubscriptionLogin}
              className="tw-rounded-sm tw-bg-[rgb(0,120,212)] tw-px-4 tw-py-2 tw-font-medium tw-text-sm tw-text-white hover:tw-bg-[rgb(16,110,190)]"
            >
              Login to Subscription
            </button>
          )}
        </div>
        {showContactAdmin && (
          <p className="tw-mb-4 tw-text-sm tw-text-[rgb(164,38,44)]">
            Please contact your administrator to manage your subscription.
          </p>
        )}
        <div className="tw-space-y-2">
          <div className="tw-flex tw-items-center tw-justify-between tw-text-sm">
            <span className="tw-text-[rgb(96,94,92)]">Documents Used</span>
            <span className="tw-font-semibold tw-text-[rgb(32,31,30)]">
              {planInfo?.documents_used} / {planInfo?.documents_total}
            </span>
          </div>
          <div className="tw-h-2 tw-overflow-hidden tw-rounded-full tw-bg-[rgb(237,235,233)]">
            <div
              className={`tw-h-full tw-transition-all ${
                currentUsagePercentage >= 90
                  ? "tw-bg-[rgb(164,38,44)]"
                  : currentUsagePercentage >= 70
                  ? "tw-bg-[rgb(255,185,0)]"
                  : "tw-bg-[rgb(0,120,212)]"
              }`}
              style={{
                width: `${currentUsagePercentage}%`,
              }}
            />
          </div>
          <p className="tw-text-[rgb(96,94,92)] tw-text-xs">
            {planInfo?.usage.remaining} documents remaining this month
          </p>
        </div>
      </div>
      {willExceedLimit && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          styles={{
            root: {
              backgroundColor: "rgb(253, 231, 233)",
              borderRadius: "2px",
            },
          }}
        >
          You cannot sign {files.length} documents. You don't have any remaining
          documents in your subscription.
        </MessageBar>
      )}

      {currentUsagePercentage > 80 && currentUsagePercentage < 100 && (
        <MessageBar
          messageBarType={MessageBarType.warning}
          isMultiline={false}
          styles={{
            root: {
              backgroundColor: "rgb(255, 244, 206)",
              borderRadius: "2px",
            },
          }}
        >
          You're approaching your monthly limit. After signing these documents,
          you'll have {planInfo ? planInfo.usage.remaining - files.length : 0}{" "}
          documents remaining.
        </MessageBar>
      )}
    </>
  );
};

export default UsageBar;
