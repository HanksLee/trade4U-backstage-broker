import utils from 'utils';
export default function ws(path) {
  const token = utils.getLStorage('MOON_ADMIN_BROKER_TOKEN');
  return new WebSocket(`ws://stock-ws.cangshu360.com/ws/broker/${path}?token=${token}`);
}