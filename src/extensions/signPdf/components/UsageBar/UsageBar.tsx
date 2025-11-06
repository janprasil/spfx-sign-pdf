import { Icon, MessageBar, MessageBarType } from "office-ui-fabric-react";
import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

type Subscription = {
  isLoggedIn: boolean;
  plan: string;
  documentsUsed: number;
  documentsLimit: number;
};

type Props = {
  willExceedLimit?: boolean;
  remainingDocuments?: number;
  usagePercentage?: number;
  subscription?: Subscription;
};

const UsageBar = ({
  willExceedLimit = false,
  remainingDocuments = 10,
  usagePercentage = 80,
  subscription = {
    isLoggedIn: false,
    plan: "Free",
    documentsUsed: 20,
    documentsLimit: 100,
  },
}: Props): React.ReactElement => {
  const { files } = useScreenSetup();
  return (
    <>
      <div className="tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] tw-bg-white tw-p-6">
        <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between">
          <div>
            <h4 className="tw-font-semibold tw-text-[rgb(32,31,30)]">
              Subscription Status
            </h4>
            <p className="tw-mt-1 tw-text-[rgb(96,94,92)] tw-text-sm">
              {subscription.plan} Plan
            </p>
          </div>
          {subscription.isLoggedIn ? (
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
            <button className="tw-rounded-sm tw-bg-[rgb(0,120,212)] tw-px-4 tw-py-2 tw-font-medium tw-text-sm tw-text-white hover:tw-bg-[rgb(16,110,190)]">
              Login to Subscription
            </button>
          )}
        </div>
        <div className="tw-space-y-2">
          <div className="tw-flex tw-items-center tw-justify-between tw-text-sm">
            <span className="tw-text-[rgb(96,94,92)]">Documents Used</span>
            <span className="tw-font-semibold tw-text-[rgb(32,31,30)]">
              {subscription.documentsUsed} / {subscription.documentsLimit}
            </span>
          </div>
          <div className="tw-h-2 tw-overflow-hidden tw-rounded-full tw-bg-[rgb(237,235,233)]">
            <div
              className={`tw-h-full tw-transition-all ${
                usagePercentage >= 90
                  ? "tw-bg-[rgb(164,38,44)]"
                  : usagePercentage >= 70
                  ? "tw-bg-[rgb(255,185,0)]"
                  : "tw-bg-[rgb(0,120,212)]"
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="tw-text-[rgb(96,94,92)] tw-text-xs">
            {remainingDocuments} documents remaining this month
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
          You cannot sign {files.length} documents. You have only{" "}
          {remainingDocuments} documents remaining in your subscription.
        </MessageBar>
      )}

      {!willExceedLimit && usagePercentage >= 80 && (
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
          you'll have {remainingDocuments - files.length} documents remaining.
        </MessageBar>
      )}
    </>
  );
};

export default UsageBar;
