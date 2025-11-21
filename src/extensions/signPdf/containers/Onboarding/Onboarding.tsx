import {
  Checkbox,
  DefaultButton,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
} from "office-ui-fabric-react";
import React, { useState } from "react";
import Box from "../../components/Box/Box";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

const Onboarding = (): React.ReactElement => {
  const {
    onboardingStatus,
    onboardingLoading,
    onboardingError,
    consent,
    closeModal,
  } = useScreenSetup();

  const [tenantConsent, setTenantConsent] = useState(false);
  const [userConsent, setUserConsent] = useState(false);

  if (!onboardingStatus) {
    return (
      <ContentWrapper>
        <Box className="tw-flex tw-items-center tw-justify-center tw-py-8">
          <Spinner label="Checking setup..." />
        </Box>
      </ContentWrapper>
    );
  }

  const tenantNeeded = onboardingStatus?.tenant?.consentRequired === true;
  const userNeeded = onboardingStatus?.user?.consentRequired === true;

  return (
    <ContentWrapper>
      <Box className="tw-space-y-4">
        <div>
          <h2 className="tw-text-xl tw-font-semibold tw-m-0">
            Almost ready to sign
          </h2>
          <p className="tw-text-sm tw-text-gray-700 tw-mt-1">
            We need your consent to finish setting things up.
          </p>
        </div>

        {onboardingError && (
          <MessageBar messageBarType={MessageBarType.error}>
            {onboardingError}
          </MessageBar>
        )}

        <div className="tw-space-y-2">
          {tenantNeeded && (
            <Checkbox
              label="I consent to creating the tenant for signing"
              checked={tenantConsent}
              onChange={(_, checked) => setTenantConsent(!!checked)}
              disabled={onboardingLoading}
            />
          )}
          {userNeeded && (
            <Checkbox
              label="I consent to creating my signing user"
              checked={userConsent}
              onChange={(_, checked) => setUserConsent(!!checked)}
              disabled={onboardingLoading}
            />
          )}
        </div>

        <div className="tw-flex tw-gap-3">
          <PrimaryButton
            text="Continue"
            onClick={async () => {
              await consent?.(userConsent, tenantConsent);
            }}
            disabled={
              onboardingLoading ||
              (tenantNeeded && !tenantConsent) ||
              (userNeeded && !userConsent)
            }
          />
          <DefaultButton text="Cancel" onClick={closeModal} />
        </div>
      </Box>
    </ContentWrapper>
  );
};

export default Onboarding;
