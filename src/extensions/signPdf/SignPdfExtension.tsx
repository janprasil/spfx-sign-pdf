import "../../../assets/dist/tailwind.css";
import {
  BaseListViewCommandSet,
  RowAccessor,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
} from "@microsoft/sp-listview-extensibility";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import * as React from "react";
import SigningModal from "./containers/AppModal/AppModal";
import { ScreenSetupProvider } from "./context/screenSetup/screenSetup";
import { SigningProvider } from "./context/signing/SigningProvider";
import { WebClientProvider } from "./context/webClient/webClient";
import { CustomAadHttpClient } from "./utils/customAadClient";
import { createClient } from "./utils/httpClient";
import { createRenderer } from "./utils/renderer";

export interface ISignPdfExtensionProperties {
  sampleTextOne: string;
}

export default class SignPdfExtension extends BaseListViewCommandSet<ISignPdfExtensionProperties> {
  private httpClient: ReturnType<typeof createClient> | null = null;
  private spClient: SPFI | null = null;
  private aadClient: CustomAadHttpClient | null = null;

  public async onInit(): Promise<void> {
    const compareOneCommand: Command = this.tryGetCommand(
      "COMMAND_SIGN_DOCUMENTS"
    );
    compareOneCommand.visible = false;
    this.context.listView.listViewStateChangedEvent.add(
      this,
      this._onListViewStateChanged
    );

    this.aadClient = CustomAadHttpClient.from(
      await this.context.aadHttpClientFactory.getClient(
        process.env.AAD_CLIENT_KEY ?? ""
      )
    );
    this.spClient = spfi().using(SPFx(this.context));
    this.httpClient = createClient(this.context);
    return Promise.resolve();
  }

  public async onExecute(
    event: IListViewCommandSetExecuteEventParameters
  ): Promise<void> {
    switch (event.itemId) {
      case "COMMAND_SIGN_DOCUMENTS":
        await this._openSignModal(event.selectedRows);
        break;
      default:
        throw new Error("Unknown command");
    }
  }

  private _onListViewStateChanged = (): void => {
    const signCommand: Command = this.tryGetCommand("COMMAND_SIGN_DOCUMENTS");
    if (signCommand) {
      signCommand.visible =
        (this.context.listView.selectedRows?.filter(
          (row) => row.getValueByName(".fileType") === "pdf"
        )?.length || 0) > 0;
    }
    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  };

  private _getSelectedPdfFiles(selectedRows: readonly RowAccessor[]) {
    const serverRelativeUrl = this.context.pageContext.site.serverRelativeUrl;
    const selectedFiles = selectedRows.map((row) => ({
      name: row.getValueByName("FileLeafRef"),
      url: row.getValueByName("FileRef"),
      id: row.getValueByName("ID"),
      serverRelativeUrl,
      spItemUrl: row.getValueByName(".spItemUrl"),
    }));
    return selectedFiles;
  }

  private async _openSignModal(
    selectedRows: readonly RowAccessor[]
  ): Promise<void> {
    if (!this.httpClient || !this.aadClient || !this.spClient) {
      throw new Error("Clients not initialized");
    }

    const renderer = createRenderer();
    const files = this._getSelectedPdfFiles(selectedRows);
    renderer.render(
      <WebClientProvider
        aadClient={this.aadClient}
        httpClient={this.httpClient}
        spClient={this.spClient as SPFI}
      >
        <ScreenSetupProvider renderer={renderer} files={files}>
          <SigningProvider>
            <SigningModal />
          </SigningProvider>
        </ScreenSetupProvider>
      </WebClientProvider>
    );
  }
}
