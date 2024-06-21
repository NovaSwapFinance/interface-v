import { useWeb3React } from '@web3-react/core'
import BNwalletModal from 'components/AccountDrawer/BNwalletModal'
import { OffchainActivityModal } from 'components/AccountDrawer/MiniPortfolio/Activity/OffchainActivityModal'
import UniwalletModal from 'components/AccountDrawer/UniwalletModal'
import { Banners } from 'components/Banner/shared/Banners'
import AddressClaimModal from 'components/claim/AddressClaimModal'
import ConnectedAccountBlocked from 'components/ConnectedAccountBlocked'
import FeatureFlagModal from 'components/FeatureFlagModal/FeatureFlagModal'
import FiatOnrampModal from 'components/FiatOnrampModal'
import { UkDisclaimerModal } from 'components/NavBar/UkDisclaimerModal'
import { PrivacyPolicyModal } from 'components/PrivacyPolicy'
import DevFlagsBox from "dev/DevFlagsBox";
import Bag from "nft/components/bag/Bag";
import TransactionCompleteModal from "nft/components/collection/TransactionCompleteModal";
import { GetTheAppModal } from "pages/Landing/components/DownloadApp/GetTheAppModal";
import { useModalIsOpen, useToggleModal } from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import { isDevelopmentEnv, isStagingEnv } from "utils/env";

export default function TopLevelModals() {
  const addressClaimOpen = useModalIsOpen(ApplicationModal.ADDRESS_CLAIM);
  const addressClaimToggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM);
  const blockedAccountModalOpen = useModalIsOpen(
    ApplicationModal.BLOCKED_ACCOUNT,
  );
  const { account } = useWeb3React();
  const accountBlocked = Boolean(blockedAccountModalOpen && account);
  const shouldShowDevFlags = isDevelopmentEnv() || isStagingEnv();

  return (
    <>
      <AddressClaimModal
        isOpen={addressClaimOpen}
        onDismiss={addressClaimToggle}
      />
      <ConnectedAccountBlocked account={account} isOpen={accountBlocked} />
      <Bag />
      {/* <UniwalletModal /> */}
      <BNwalletModal />
      <Banners />

      <OffchainActivityModal />
      <TransactionCompleteModal />
      <FiatOnrampModal />
      <UkDisclaimerModal />
      <GetTheAppModal />
      <PrivacyPolicyModal />
      <FeatureFlagModal />
      {shouldShowDevFlags && <DevFlagsBox />}
    </>
  );
}
