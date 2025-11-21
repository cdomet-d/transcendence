/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */

/** Size options for Avatar components.
 * @remarks
 * - `iicon`: Extra small, icon size
 * - `ismall`: Small size
 * - `imedium`: Medium size
 * - `ilarge`: Large size
 */
export type Size = 'iicon' | 'ismall' | 'imedium' | 'ilarge' | 'ifs';

/** Image metadata for assets.
 * @property {string} alt - Alt text for accessibility.
 * @property {string} id - Unique image identifier.
 * @property {Size} size - Predefined image size variant (see {@link Size})
 * @property {string} src - Image source URL.
 */
export interface ImgData {
    id: string;
    alt: string;
    size: Size;
    src: string;
}

export type BackgroundTheme = 'default' | 'farm' | 'ocean' | 'forest';
/* -------------------------------------------------------------------------- */
/*                                    Menus                                   */
/* -------------------------------------------------------------------------- */

/** Menu orientation styles for layout rendering.
 * @remarks
 * - `vertical`: Stacked menu items
 * - `horizontal`: Inline menu items
 */
export type MenuStyle = 'vertical' | 'horizontal';

/** Menu sizing scale.
 * @remarks
 * - `s`: Small size
 * - `m`: Medium size
 * - `l`: Large size
 */
export type MenuSize = 's' | 'm' | 'l';

/** Dropdown menu styling modes.
 * @remarks
 * - `dynamic`: allows dynamic styling, meaning that background of the toggle
 *	  will change according to the selected option.
 * - `static`: disallows dynamic styling
 */
export type DropdownBg = 'dynamic' | 'static';

export interface navigationLinksData {
    id: string;
    datalink: string;
    href: string;
    title: string;
    img: ImgData | null;
}

/** Metadata describing a tab component.
 * @property {string} content - Visible text or HTML content within the tab button.
 * @property {boolean} default - Whether this is the default active tab on load.
 * @property {string} id - Unique tab identifier.
 * @property {UserData[] | MatchOutcome[]} panelContent - Array of data to populate tab panel.
 */
export interface TabData {
    content: string;
    default: boolean;
    id: string;
    panelContent: HTMLElement | null;
}

export interface MenuData {
    buttons?: ButtonData[];
    links?: navigationLinksData[];
}

/* -------------------------------------------------------------------------- */
/*                                 Typography                                 */
/* -------------------------------------------------------------------------- */

/** Allowed font sizes for text styling.
 * @remarks
 * - `t1`, `t2`, `t3`: Title sizes (largest to smallest)
 * - `f-s`, `f-m`, `f-l`: Font sizes small → large
 * - `f-regular`: Regular text size
 */
export type FontSize = 't0' | 't1' | 't2' | 't3' | 'f-s' | 'f-m' | 'f-l' | 'f-regular';

/** Font color style names used in UI themes.
 * @remarks
 * - `f-yellow`: Yellow text color
 * - `f-orange`: Orange text color
 */
export type FontColor = 'f-yellow' | 'f-orange';

/** Font weight options.
 * @remarks
 * - `f-bold`: Bold font weight
 */
export type FontWeight = 'f-bold';

/** Styles the color of the text depending on the background
 * @remarks
 * - `dark`: for dark background
 * - `light`: for light background
 */
export type ColorTheme = 'dark' | 'light';

export type Feedback = 'error' | 'success';

/* -------------------------------------------------------------------------- */
/*                                   Buttons                                  */
/* -------------------------------------------------------------------------- */
/** HTML button type attribute values.
 * @remarks
 * Matches native `<button type="...">` options.
 */
export type BtnType = 'button' | 'submit' | 'reset';

/** Limits allowed modifications to button style.
 *Names are pretty self-explanatory: the button is either green or red.
 */
export type BtnStyles = 'green' | 'red';

/** Button metadata for UI rendering.
 * @property {BtnType} type - Button functional type - see {@link BtnType}.
 * @property {string} id - The button's id for cache retrieval
 * @property {string | null} content - Text content of the button.
 * @property {ImgData | null} img - Optional image metadata associated with the button - see {@link ImgData}
 * @property {string} ariaLabel - Accessibility label for screen readers.
 * @property {BtnStyles} [style] - Optional style modifier for button appearance - see {@link BtnStyles}.
 */
export interface ButtonData {
    type: BtnType;
    id: string;
    content: string | null;
    img: ImgData | null;
    ariaLabel: string;
    style?: BtnStyles;
}

/* -------------------------------------------------------------------------- */
/*                               Profile & Users                              */
/* -------------------------------------------------------------------------- */

/** Relationship between viewer and a profile.
 * @remarks
 * - `self`: Profile belongs to the viewer
 * - `friend`: Viewer is friends with the profile owner
 * - `pending`: Friend request pending
 * - `stranger`: No established relationship
 */
export type ProfileView = 'self' | 'friend' | 'pending' | 'stranger';

/** User profile data model.
 * @property {ImgData} avatar - User's avatar image metadata.
 * @property {string} biography - Short biography text.
 * @property {string} id - Unique user identifier string.
 * @property {string} language - User's language preference.
 * @property {string} profileColor - Color theme for the profile.
 * @property {ProfileView} relation - Relationship to viewer - see {@link ProfileView}.
 * @property {string} since - Account creation date.
 * @property {boolean} status - Online/offline status.
 * @property {string} username - Display username.
 * @property {string} winstreak - Current consecutive wins count.
 */
export interface UserData {
    avatar: ImgData;
    biography: string;
    id: string;
    language: string;
    profileColor: string;
    relation: ProfileView;
    since: string;
    status: boolean;
    username: string;
    winstreak: string;
}

/* -------------------------------------------------------------------------- */
/*                                Notifications                               */
/* -------------------------------------------------------------------------- */

/** Describes the type of game a user is invited to.
 * Used by notifications.
 */
export type GameType = '1 vs 1' | 'tournament';

/* -------------------------------------------------------------------------- */
/*                               Forms & Inputs                               */
/* -------------------------------------------------------------------------- */

/** Form metadata describing action, fields, and buttons.
 * @property {string} action - Form submission URL.
 * @property {string} ariaLabel - Accessibility label for form.
 * @property {ButtonData} button - Form button metadata.
 * @property {InputFieldsData[]} fields - Array of input field metadata - see {@link InputFieldsData}
 * @property {string} heading - Form heading text.
 * @property {string} id - Unique form identifier.
 * @property {string} method - HTTP method for form submission.
 */
export interface FormDetails {
    action: string;
    ariaLabel: string;
    button: ButtonData;
    fields: InputFieldsData[];
    heading: string;
    id: string;
    method: string;
}

/** Metadata describing an HTML input field.
 * @property {string} id - Unique identifier for the input element.
 * @property {string} labelContent - Visible text for the label element.
 * @property {string} pattern - Regex pattern string for input validation.
 * @property {string} placeholder - Placeholder text for the input.
 * @property {boolean} required - Whether input is mandatory.
 * @property {string} type - Input type attribute (e.g. text, range, etc).
 * @property {string} [max] - Optional max numeric/date value.
 * @property {string} [min] - Optional min numeric/date value.
 * @property {string} [step] - Optional step value for increments.
 */
export interface InputFieldsData {
    id: string;
    labelContent: string;
    pattern: string;
    placeholder: string;
    required: boolean;
    type: string;
    max?: string;
    min?: string;
    step?: string;
}

/* -------------------------------------------------------------------------- */
/*                            Matches & Tournaments                           */
/* -------------------------------------------------------------------------- */

/** Describes outcome of a match.
 * @property {string} date - Date of the match.
 * @property {string} opponent - Opponent name.
 * @property {string} outcome - Result (win/loss/draw).
 * @property {string} score - Match score.
 * @property {string} duration - Duration of the match.
 * @property {boolean} tournament - If it was a tournament match.
 */
export interface MatchOutcome {
    date: string;
    opponent: string;
    outcome: string;
    score: string;
    duration: string;
    tournament: boolean;
}

/** Match participants data.
 * @property {UserData} player1 - First player data.
 * @property {UserData} player2 - Second player data.
 */
export interface MatchParticipants {
    player1: UserData;
    player2: UserData;
}

export type CourtTheme = 'default' | 'farm' | 'ocean' | 'forest';

export interface pongTheme {
    color: string;
    theme: CourtTheme;
}
