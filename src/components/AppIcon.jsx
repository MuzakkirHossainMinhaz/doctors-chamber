import * as BsIcons from "react-icons/bs";

const iconMap = {
  "bi-ambulance": "BsHeartPulse",
  "bi-apple": "BsApple",
  "bi-arrow-clockwise": "BsArrowClockwise",
  "bi-arrow-left": "BsArrowLeft",
  "bi-arrow-right": "BsArrowRight",
  "bi-award": "BsAward",
  "bi-bell": "BsBell",
  "bi-box-arrow-in-right": "BsBoxArrowInRight",
  "bi-box-arrow-right": "BsBoxArrowRight",
  "bi-calendar": "BsCalendar",
  "bi-calendar-check": "BsCalendarCheck",
  "bi-calendar-plus": "BsCalendarPlus",
  "bi-calendar-week": "BsCalendarWeek",
  "bi-calendar-x": "BsCalendarX",
  "bi-calendar2-check": "BsCalendarCheck",
  "bi-chat-dots": "BsChatDots",
  "bi-check-circle": "BsCheckCircle",
  "bi-check-circle-fill": "BsCheckCircleFill",
  "bi-clipboard2-pulse": "BsClipboard2Pulse",
  "bi-clock": "BsClock",
  "bi-clock-history": "BsClockHistory",
  "bi-credit-card": "BsCreditCard",
  "bi-currency-dollar": "BsCurrencyDollar",
  "bi-database-check": "BsShieldCheck",
  "bi-envelope": "BsEnvelope",
  "bi-exclamation-triangle": "BsExclamationTriangle",
  "bi-exclamation-triangle-fill": "BsExclamationTriangleFill",
  "bi-facebook": "BsFacebook",
  "bi-gear": "BsGear",
  "bi-geo-alt": "BsGeoAlt",
  "bi-github": "BsGithub",
  "bi-google": "BsGoogle",
  "bi-graph-up": "BsGraphUp",
  "bi-grid-3x3-gap": "BsGrid3X3Gap",
  "bi-heart": "BsHeart",
  "bi-heart-pulse": "BsHeartPulse",
  "bi-heart-pulse-fill": "BsHeartPulseFill",
  "bi-hospital": "BsHospital",
  "bi-hourglass-split": "BsHourglassSplit",
  "bi-house": "BsHouse",
  "bi-house-door": "BsHouseDoor",
  "bi-inbox": "BsInbox",
  "bi-info-circle": "BsInfoCircle",
  "bi-instagram": "BsInstagram",
  "bi-journal-text": "BsJournalText",
  "bi-linkedin": "BsLinkedin",
  "bi-lock": "BsLock",
  "bi-lock-fill": "BsLockFill",
  "bi-paypal": "BsPaypal",
  "bi-patch-check-fill": "BsPatchCheckFill",
  "bi-pencil": "BsPencil",
  "bi-people": "BsPeople",
  "bi-people-gear": "BsPeople",
  "bi-person": "BsPerson",
  "bi-person-badge": "BsPersonBadge",
  "bi-person-check": "BsPersonCheck",
  "bi-person-heart": "BsPerson",
  "bi-person-plus": "BsPersonPlus",
  "bi-plus-circle": "BsPlusCircle",
  "bi-question-circle": "BsQuestionCircle",
  "bi-receipt": "BsReceipt",
  "bi-search": "BsSearch",
  "bi-send": "BsSend",
  "bi-shield-check": "BsShieldCheck",
  "bi-shield-exclamation": "BsShieldExclamation",
  "bi-speedometer2": "BsSpeedometer2",
  "bi-stethoscope": "BsHeartPulse",
  "bi-telephone": "BsTelephone",
  "bi-telephone-fill": "BsTelephoneFill",
  "bi-trash": "BsTrash",
  "bi-twitter": "BsTwitter",
  "bi-wifi-off": "BsWifiOff",
};

const AppIcon = ({
  name,
  className,
  style,
  title,
  "aria-label": ariaLabel,
  ...props
}) => {
  const componentName = iconMap[name] || "BsQuestionCircle";
  const IconComponent = BsIcons[componentName] || BsIcons.BsQuestionCircle;
  const accessibilityProps = ariaLabel ? { "aria-label": ariaLabel } : { "aria-hidden": true };

  return (
    <IconComponent
      className={className}
      style={style}
      title={title}
      {...accessibilityProps}
      {...props}
    />
  );
};

export default AppIcon;
