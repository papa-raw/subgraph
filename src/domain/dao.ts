import { Address, BigInt, Entity, store, Value } from '@graphprotocol/graph-ts';
import { DAOToken } from '../types/DAOToken/DAOToken';
import { Reputation } from '../types/Reputation/Reputation';
import { DAO } from '../types/schema';
import { Avatar } from '../types/UController/Avatar';
import { UController } from '../types/UController/UController';

export function getDAO(id: string): DAO {
  let dao = store.get('DAO', id) as DAO;
  if (dao == null) {
    dao = new DAO(id);
    dao.membersCount = BigInt.fromI32(0);
  }

  return dao;
}

export function increaseDAOmembersCount(id: string): void {
  let dao = getDAO(id);
  dao.membersCount = dao.membersCount.plus(BigInt.fromI32(1));
  saveDAO(dao);
}

export function decreaseDAOmembersCount(id: string): void {
  let dao = getDAO(id);
  dao.membersCount = dao.membersCount.minus(BigInt.fromI32(1));
  saveDAO(dao);
}

export function saveDAO(dao: DAO): void {
  store.set('DAO', dao.id, dao);
}

export function insertNewDAO(
  uControllerAddress: Address,
  avatarAddress: Address,
): DAO {
  let uController = UController.bind(uControllerAddress);
  let org = uController.organizations(avatarAddress);
  let nativeTokenAddress = org.value0;
  let nativeReputationAddress = org.value1;

  let avatar = Avatar.bind(avatarAddress);
  let dao = getDAO(avatarAddress.toHex());
  dao.name = avatar.orgName().toString();
  dao.nativeToken = nativeTokenAddress.toHex();
  dao.nativeReputation = nativeReputationAddress.toHex();
  saveDAO(dao);

  return dao;
}