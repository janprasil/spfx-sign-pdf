import { DefaultButton, PrimaryButton, Stack, Text } from "@fluentui/react";
import * as React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import strings from "SignPdfStrings";
import "./styles.css";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "office-ui-fabric-react";

const InitialScreen = (): React.ReactElement => {
  const { files, closeModal, setScreen } = useScreenSetup();
  return (
    <div>
      <Text variant="large" block as="h2">
        {strings.signingTitle}
      </Text>
      <DetailsList
        items={files}
        columns={[
          {
            key: "fileName",
            name: strings.selectedFilesLabel,
            fieldName: "name",
            minWidth: 100,
            maxWidth: 300,
            isResizable: false,
          },
        ]}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { marginTop: 20 } }}
      >
        <PrimaryButton
          text={strings.continueButton}
          onClick={() => setScreen("certificate")}
        />
        <DefaultButton text={strings.cancelButton} onClick={closeModal} />
      </Stack>
    </div>
  );
};

export default InitialScreen;
