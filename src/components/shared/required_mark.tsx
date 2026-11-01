import { FIELD_REQUIRED_MARK } from '#components/shared/field_styles';

/** Visual asterisk hidden from assistive technology; the native `required` attribute conveys the state. */
export function RequiredMark() {
	return (
		<span className={FIELD_REQUIRED_MARK} aria-hidden="true">
			*
		</span>
	);
}
