import Big from 'big.js';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import * as R from 'ramda';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import chainConfig from '@/chainConfig';
import {
  useAccountDelegationsQuery,
  useAccountRedelegationsQuery,
  useAccountUndelegationsQuery,
  useValidatorsQuery,
  ValidatorsQuery,
} from '@/graphql/types/general_types';
import type {
  DelegationType,
  RedelegationType,
  StakingState,
} from '@/screens/account_details/components/staking/types';
import type { RewardsType } from '@/screens/account_details/types';
import { ValidatorType } from '@/screens/validators/components/list/types';
import { formatToken } from '@/utils/format_token';
import { getDenom } from '@/utils/get_denom';

const { primaryTokenUnit } = chainConfig();

export const ROWS_PER_PAGE = 10;

export const formatDelegations = (
  data: Array<{
    validator_address?: string;
    coins?: MsgCoin[];
  }>,
  validatorsCommission: Pick<ValidatorType, 'validator' | 'commission'>[],
  rewards: RewardsType
) =>
  data
    .map((x): DelegationType => {
      const validator = x?.validator_address ?? '';
      const delegation = getDenom(x.coins, primaryTokenUnit);
      return {
        validator,
        commission:
          numeral(
            validatorsCommission.find((val) => val.validator === validator)?.commission?.toFixed(3)
          ).value() ?? 0,
        amount: formatToken(delegation.amount, delegation.denom),
        reward: rewards[validator],
      };
    })
    .sort((a, b) => (Big(a.amount?.value).gt(b.amount?.value) ? -1 : 1));

export const formatRedelegations = (
  data: Array<{
    entries?: Array<{ balance: string | number; completion_time?: string }>;
    validator_src_address?: string;
    validator_dst_address?: string;
  }>
) => {
  const results: RedelegationType[] = [];
  data.forEach((x) => {
    x.entries?.forEach((y) => {
      results.push({
        from: x?.validator_src_address ?? '',
        to: x?.validator_dst_address ?? '',
        amount: formatToken(y.balance, primaryTokenUnit),
        completionTime: y?.completion_time ?? '',
      });
    });
  });

  results.sort((a, b) => (a.completionTime < b.completionTime ? -1 : 1));

  return results;
};

export const formatUnbondings = (
  data: Array<{
    entries?: Array<{ balance: string | number; completion_time?: string }>;
    validator_address?: string;
  }>
) => {
  const results: Array<{ validator: string; amount: TokenUnit; completionTime: string }> = [];
  data.forEach((x) => {
    x?.entries?.forEach((y) => {
      results.push({
        validator: x?.validator_address ?? '',
        amount: formatToken(y.balance, primaryTokenUnit),
        completionTime: y?.completion_time ?? '',
      });
    });
  });

  results.sort((a, b) => (a.completionTime < b.completionTime ? -1 : 1));

  return results;
};

export const useStaking = (
  rewards: RewardsType,
  delegationsPage: number,
  redelegationsPage: number,
  unbondingsPage: number
) => {
  const router = useRouter();
  const [state, setState] = useState<StakingState>({
    tab: 0,
  });

  const [validatorsCommission, setValidatorsCommission] = useState<
    Pick<ValidatorType, 'validator' | 'commission'>[]
  >([]);

  // ==========================
  // Fetch Data
  // ==========================
  useValidatorsQuery({
    onCompleted: (data) => {
      formatValidators(data);
    },
  });

  // return a list of all validators with their address and commission rate
  const formatValidators = useCallback(
    (data: ValidatorsQuery): { items: Pick<ValidatorType, 'validator' | 'commission'>[] } => {
      const formattedItems: Pick<ValidatorType, 'validator' | 'commission'>[] = data.validator
        .filter((x) => x.validatorInfo)
        .map((x) => ({
          validator: x.validatorInfo?.operatorAddress ?? '',
          commission: (x?.validatorCommissions?.[0]?.commission ?? 0) * 100,
        }));

      setValidatorsCommission(formattedItems);

      return {
        items: formattedItems,
      };
    },
    []
  );

  const address = Array.isArray(router?.query?.address)
    ? router.query.address[0]
    : router?.query?.address ?? '';

  // =====================================
  // delegations
  // =====================================
  const {
    data: delegationsData,
    loading: delegationsLoading,
    error: delegationsError,
    refetch: delegationsRefetch,
  } = useAccountDelegationsQuery({
    variables: {
      address,
      limit: ROWS_PER_PAGE,
      offset: delegationsPage * ROWS_PER_PAGE,
    },
  });

  const [delegationsPagination, setDelegationsPagination] = useState<number | undefined>();

  useEffect(() => {
    if (delegationsError) {
      delegationsRefetch({ pagination: false });
    }
  }, [delegationsError, delegationsRefetch]);

  const {
    data: paginationData,
    error: paginationError,
    refetch: paginationRefetch,
  } = useAccountDelegationsQuery({
    variables: {
      address,
      limit: 0,
      offset: 0,
      pagination: true,
    },
    skip: delegationsPagination !== undefined,
  });

  useEffect(() => {
    if (paginationError) {
      console.error('Error fetching pagination data:', paginationError);
      paginationRefetch();
    } else if (paginationData) {
      setDelegationsPagination(paginationData?.delegations?.pagination?.total ?? 0);
    }
  }, [paginationData, paginationError, paginationRefetch]);

  // =====================================
  // redelegations
  // =====================================
  const {
    data: redelegationsData,
    loading: redelegationsLoading,
    error: redelegationsError,
    refetch: redelegationsRefetch,
  } = useAccountRedelegationsQuery({
    variables: {
      address,
      limit: ROWS_PER_PAGE,
      offset: redelegationsPage * ROWS_PER_PAGE,
    },
  });

  const [redelegationsPagination, setRedelegationsPagination] = useState<number | undefined>();

  useEffect(() => {
    if (redelegationsError) {
      console.error('Error fetching redelegations:', redelegationsError);
      redelegationsRefetch({ pagination: false });
    }
  }, [redelegationsError, redelegationsRefetch]);

  const {
    data: redelegationsPaginationData,
    error: redelegationsPaginationError,
    refetch: redelegationsPaginationRefetch,
  } = useAccountRedelegationsQuery({
    variables: {
      address,
      limit: 0,
      offset: 0,
      pagination: true,
    },
    skip: redelegationsPagination !== undefined,
  });

  useEffect(() => {
    if (redelegationsPaginationError) {
      console.error('Error fetching redelegations pagination data:', redelegationsPaginationError);
      redelegationsPaginationRefetch();
    } else if (redelegationsPaginationData) {
      setRedelegationsPagination(
        redelegationsPaginationData?.redelegations?.pagination?.total ?? 0
      );
    }
  }, [redelegationsPaginationData, redelegationsPaginationError, redelegationsPaginationRefetch]);

  // =====================================
  // unbondings
  // =====================================
  const {
    data: undelegationsData,
    loading: undelegationsLoading,
    error: undelegationsError,
    refetch: undelegationsRefetch,
  } = useAccountUndelegationsQuery({
    variables: {
      address,
      limit: ROWS_PER_PAGE,
      offset: unbondingsPage * ROWS_PER_PAGE,
    },
  });

  const [undelegationsPagination, setUndelegationsPagination] = useState<number | undefined>();

  useEffect(() => {
    if (undelegationsError) {
      console.error('Error fetching undelegations:', undelegationsError);
      undelegationsRefetch({ pagination: false });
    }
  }, [undelegationsError, undelegationsRefetch]);

  const {
    data: undelegationsPaginationData,
    error: undelegationsPaginationError,
    refetch: undelegationsPaginationRefetch,
  } = useAccountUndelegationsQuery({
    variables: {
      address,
      limit: 0,
      offset: 0,
      pagination: true,
    },
    skip: undelegationsPagination !== undefined,
  });

  useEffect(() => {
    if (undelegationsPaginationError) {
      console.error('Error fetching undelegations pagination data:', undelegationsPaginationError);
      undelegationsPaginationRefetch();
    } else if (undelegationsPaginationData) {
      setUndelegationsPagination(
        undelegationsPaginationData?.undelegations?.pagination?.total ?? 0
      );
    }
  }, [undelegationsPaginationData, undelegationsPaginationError, undelegationsPaginationRefetch]);

  // Handle tab change
  const handleTabChange = useCallback(
    (_event: SyntheticEvent<Element, globalThis.Event>, newValue: number) => {
      setState((prevState) => {
        const newState = { ...prevState, tab: newValue };
        return R.equals(prevState, newState) ? prevState : newState;
      });
    },
    []
  );

  return {
    stakingState: state,
    delegations: {
      loading: delegationsLoading,
      count: delegationsPagination,
      data: formatDelegations(
        delegationsData?.delegations?.delegations ?? [],
        validatorsCommission,
        rewards
      ),
      error: delegationsError,
    },
    redelegations: {
      loading: redelegationsLoading,
      count: redelegationsPagination,
      data: formatRedelegations(redelegationsData?.redelegations?.redelegations ?? []),
      error: redelegationsError,
    },
    unbondings: {
      loading: undelegationsLoading,
      count: undelegationsPagination,
      data: formatUnbondings(undelegationsData?.undelegations?.undelegations ?? []),
      error: undelegationsError,
    },
    handleTabChange,
  };
};
