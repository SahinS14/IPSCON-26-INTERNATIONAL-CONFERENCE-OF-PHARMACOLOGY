const $ = (s) => document.querySelector(s);
const safe = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let profile = read('wac-profile', {
  title: 'Dr.',
  name: 'Yogesh A. Kulkarni',
  email: sessionStorage.getItem('delegate-email') || 'yogeshkulkarni101@yahoo.com',
  dob: '1982-05-16',
  gender: 'Male',
  mobile: '9930030548',
  whatsapp: '919930030548',
  organization:
    'Shobhaben Pratapbhai Patel School of Pharmacy & Technology Management, SVKM’s NMIMS',
  address: 'Vile Parle (West), Mumbai',
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  zip: '400056',
});
let abstracts = read('wac-abstracts', []);
let draft = read('wac-draft', {});
const icon = (name) => {
  const paths = {
    instructions: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    submit:
      '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8m-8 4h5"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    password:
      '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    exit: '<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m6-13 5 5-5 5m-7-5h12"/>',
    home: '<path d="m3 10 9-7 9 7v10H3Zm6 10v-7h6v7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
const portalHeader = document.querySelector('.main>header');
const pages = [
  ['instructions', 'ⓘ', 'Instructions'],
  ['submit', '▧', 'Submit abstract'],
  ['profile', '♙', 'User profile'],
  ['password', '⚿', 'Change password'],
];
const pageUrls = {
  instructions: 'dashboard.html',
  submit: 'dashboard-abstract.html',
  profile: 'dashboard-profile.html',
  password: 'dashboard-password.html',
};
const windowIcon = icon;
$('#menu').innerHTML = icon('menu');
$('#signout').innerHTML = icon('exit') + '<span>Sign out</span>';
$('nav').innerHTML = pages
  .map(
    ([id, icon, label]) =>
      `<a href="${pageUrls[id]}" data-page="${id}">${windowIcon(id)}${label}</a>`,
  )
  .join('');
const head = (eye, title, sub) =>
  `<div class="page-heading"><div><p class="eyebrow">${eye}</p><h1>${title}</h1><p class="subtitle">${sub}</p></div></div>`;
const preview = '';
const button = (page, text, cls = 'secondary') =>
  `<button class="${cls}" data-page="${page}" type="button">${text} <span>${icon('arrow')}</span></button>`;
const notes = `<h3>Submission notes</h3><ul><li>Poor internet connectivity may prevent a confirmation from appearing. A resubmission may indicate that your abstract has already been submitted.</li><li>If you do not receive confirmation, check your spam folders.</li><li>For confirmation, email <a href="mailto:ipswbpvpi@gmail.com">ipswbpvpi@gmail.com</a> mentioning only your abstract title and author name. The team will confirm whether it was submitted.</li><li>For any other submission problems, email the same address.</li><li>Complete every field marked with an asterisk (*).</li></ul>`;
function instructions() {
  return `<div class="card instructions-content"><div class="guide-row"><span class="number">1.</span><div><p>If you are on mobile, access the three horizontal lines on the top-left corner of your screen for the menu navigation.</p></div></div><div class="guide-row"><span class="number">2.</span><div><div class="instruction-heading"><h3>Delegate Registration :</h3><div class="instruction-buttons"><button type="button" class="primary" data-registration="online">Online Payment For Delegate Registration</button><button type="button" class="secondary" data-registration="offline">Offline Payment For Delegate Registration</button></div></div><ol class="instruction-letters" type="a"><li>Delegate Registration can be done Online & Offline</li><li>If the Online Delegate Registration payment is successful, you will be able to view the Delegate ID and other details on the Delegate Registration page.</li><li>For Offline Delegate Registration, please enter the details of the payment you have made and submit. The concerned conference organisers will verify the payment entry and mark it either as Accepted or Incorrect. If Accepted, you will be able to see the Delegate ID and other details on the Delegate Registration page.</li></ol></div></div><div class="guide-row"><span class="number">3.</span><div><div class="instruction-heading"><h3>Abstract Submission :</h3><div class="instruction-buttons">${button('submit', 'Abstract Submission', 'primary')}</div></div><ol class="instruction-letters" type="a"><li>You are allowed to submit only two abstracts for the IPSCON ’26.</li><li><div class="instruction-status-line"><span>The status of the abstracts submitted can be viewed here :</span><div class="instruction-buttons"><button type="button" class="primary" id="manage-abstracts">Manage Abstracts</button></div></div><div class="instruction-status" id="abstract-status" hidden>${abstracts.length ? abstracts.map((a) => `<p><strong>${safe(a.abstractTitle)}</strong> · Draft saved</p>`).join('') : '<p>No abstracts to display.</p>'}</div></li></ol></div></div><div class="guide-row"><span class="number">4.</span><div><p>Please try another browser or incognito mode, if you are facing any trouble. For any further issue, please email to <a href="mailto:helpdesk@ipswb.com">helpdesk@ipswb.com</a></p></div></div></div>`;
}
const guidelines = `<h3>Abstract heading guidelines:</h3><ol><li>Title of abstract - should be in sentence case, do not capitalise the title.</li><li>Author(s) name(s) - provide first initial, name, and surname. The author who fills the form will be considered as the first author.</li><li>Affiliated institution/organisation(s) - Name of institution/ organisation, city, state and country of origin should be provided without fail. Provide affiliations of all coauthors as well.</li><li>Email addresses of all the authors should be provided</li></ol><h3>Abstract text guidelines:</h3><ol><li>Abstracts longer than 300 words will not be accepted.</li><li>Abstracts as reports of original work should follow CONSORT extension for abstract for clinical interventions, STROBE Statement checklist for observational studies and ARRIVE guidelines for in-vivo research. The abstracts should contain brief but complete statements of: Background, Objectives, Methods, Results/Discussion, and Conclusion(s).</li><li>Abstracts of other than original research should contain: an introduction to the issue being addressed, the aims of the work undertaken (e.g. a project, or a report or other document), an indication of the main content or findings in the paper, and a conclusion.</li><li>The abstract must contain sufficient information to provide readers with a clear understanding of the study/report independent of the presentation.</li><li>Abstracts stating that results or conclusions 'will be discussed', 'will be presented' or similar will not be accepted.</li><li>Abstracts should be written in the past tense (i.e. should state what was done, not what is being, will or might be done).</li><li>Non-standard abbreviations (NSA) must be defined in the instance of their first use as exemplified in this sentence.</li><li>Abstracts without clear mention about funding and disclosure of conflict of interest will not be accepted.</li><li>Abstracts must be submitted via the conference website not later than 15 Sep 2026</li></ol><h3>Selection and scheduling of abstracts for presentation</h3><p>Authors will be notified of the decision of the scientific committee regarding the acceptance of their abstracts on 25 Sept 2026. Depending on the quality and the content of the submission, the submission may be accepted for oral presentation or as a poster. Selection of an abstract for poster presentation does not necessarily mean that it is inferior. The decision of the scientific committee will be final in this matter. Negotiations will not be entertained.</p><h3>Abstracts for Oral Presentation</h3><p>Oral abstracts will be presented in separate sessions grouped in accordance with the themes of the conference.</p><p>An expert in the field will moderate the presentations and chair each oral abstract session.</p><h3>Abstracts for Poster Presentation</h3><p>During the Congress, space will be available for a poster exhibition (electronic mode). Posters are graphic presentations of a scientific paper. The criteria are the same as for scientific papers.</p><p>The schedule for the presentation of the oral abstracts and posters will be intimated to the authors on well before the conference date.</p><h3>Format for oral presentations and posters</h3><p>All oral presentations will get 8 minutes followed by 2 minutes of discussion moderated by an expert. Outstanding submissions may be chosen for a longer presentation.</p><p>Posters may be made in the dimension 3' x 4' and should include all essential information without being too lengthy. It is strongly recommended to include charts, tables and figures in the abstracts for effective communication.</p><h3>Publication of abstracts</h3><p>The selected abstracts (submitted for oral and poster presentation) will be published in the abstract book of WAC. The organizers will also have rights to publish/decide not to publish the abstracts as a supplement edition of a peer reviewed; PubMed indexed journal from the field. However, authors have to register for the congress for the abstracts to be published in the abstract book as well as the research journal.</p><h3>Best oral presentations and posters</h3><p>The best oral presentation and poster will be appropriately recognized by a team of reviewers during WAC and will receive certificates.</p><h3>Selection of abstracts and allocation to oral, poster and Ebook sections</h3><p>The WAC committee will decide whether the submitted abstract is selected and subsequently slotted as oral, poster or Ebook presentation. The decision of the review committee will be final. The authors cannot submit an abstract to be considered for only oral presentation. However, if the authors want the abstract to be chosen for poster or Ebook only, this may be specified.</p>`;
const agreement = `<p>By accepting this agreement, the authors confirm that they are submitting their original research work for presentation during IPSCON ’26. WAC will adopt a stringent review process to select abstracts for presentation in oral and poster sessions as well as the Ebook section.</p><ul><li>All scientific abstracts must provide sufficient detail of study objectives, methods, results, and conclusion(s).</li><li>Scientific abstracts will be rejected if they have:<ul><li>Absent or inadequate descriptions of the methods, results or conclusions.</li><li>An insufficiently quantitative description of the results.</li><li>Allusions to any information (especially results or conclusions) not contained in the abstract but which is to be presented at the meeting.</li><li>Jargon, undefined non-standard terms or abbreviations.</li></ul></li><li>Abstracts of a descriptive nature may be accepted for presentation in limited numbers because of their potential interest to the meeting. Such abstracts must still contain sufficient description of objectives of the report, description of the subject, information to substantiate opinions or statements, and a conclusion.</li><li>A reader of the abstract must be able to understand the methods by which the results were obtained and must see how the results justify the conclusions, in the absence of attendance at the presentation. The target group of the conference must be kept in mind; these include researchers, practitioners, planners, manufacturers, consumer groups, and traders.</li><li>Abstracts and posters should not be used for advertising products. There is space at the Conference venue for exhibition/presentation of products. Authors agree that they will comply with the following guidelines when preparing abstracts.</li></ul>`;
const disclaimers = [
  'I hereby agree that I have read the Author Agreement and I would abide by it.',
  'I agree that my abstract, if selected for presentation in WAC, may be published free of charge by the organizers in electronic and print media, including conference proceedings, the organizers’ website and post-conference publications.',
  'I agree to send the PowerPoint presentation at least one week before the conference if selected, and agree to its free publication by the organizers in electronic and print media.',
  'I agree that audio, video and still photography of my WAC presentation may be published free of charge or at nominal cost in electronic and print media, including YouTube and live or recorded webcasts.',
];
function field(label, name, value = '', type = 'text', extra = '') {
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${safe(value)}" ${extra}></div>`;
}
function radio(label, name) {
  return `<fieldset class="question"><legend>${label} *</legend>${['Yes', 'No'].map((v) => `<label class="radio"><input type="radio" name="${name}" value="${v}" required ${draft[name] === v ? 'checked' : ''}>${v}</label>`).join('')}</fieldset>`;
}
const section = (n, title, body) =>
  `<section class="card"><div class="section-title"><span>${n}</span><h2>${title}</h2></div>${body}</section>`;
function submit() {
  return (
    head(
      'ABSTRACT SUBMISSION',
      'Abstract Submission Module',
      'Submit your research for the IPSCON ’26',
    ) +
    preview +
    `<form id="abstract-form">${section('01', 'Author information', `<div class="note">Corresponding author · The account holder is the first author by default and cannot be edited.</div><div class="form-grid">${field('Title *', 'authorTitle', profile.title, 'text', 'readonly')}${field('Author name *', 'authorName', profile.name, 'text', 'readonly')}${field('Designation', 'designation', profile.organization, 'text', 'readonly')}${field('Email *', 'authorEmail', profile.email, 'email', 'readonly')}</div><div class="form-grid"><div>${radio('Is there an additional author for your abstract?', 'additional')}</div><div>${radio('Are you a Student/Trainee/Fellow/Faculty?', 'student')}</div></div><div id="coauthors" ${draft.additional === 'Yes' ? '' : 'hidden'}><div id="author-list"></div><button type="button" id="add-author" class="secondary">+ Add another coauthor</button></div>`)}${section('02', 'Details of abstract', `<details open class="abstract-guidelines"><summary>Guidelines for abstract presentation for oral and poster session</summary><div class="prose">${guidelines}</div></details><div class="form-grid"><div class="field"><label for="theme">Theme *</label><select name="theme" id="theme" required><option value="">Please select theme</option>${['Clinical research', 'Fundamental research', 'Medicinal plants & pharmacology', 'Public health & integrative medicine', 'Education & innovation', 'Other'].map((x) => `<option ${draft.theme === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>${field('Title of abstract *', 'abstractTitle', draft.abstractTitle || '', 'text', 'required maxlength="300"')}</div><div class="word-bar"><span>Maximum 300 words across Purpose, Methods, Results and Conclusion.</span><strong id="word-count">0 / 300 words</strong></div><div class="form-grid">${['Purpose', 'Methods', 'Results', 'Conclusion'].map((x) => `<div class="field wide"><label for="${x.toLowerCase()}">${x} *</label><textarea id="${x.toLowerCase()}" name="${x.toLowerCase()}" required placeholder="Describe your ${x.toLowerCase()}…">${safe(draft[x.toLowerCase()] || '')}</textarea></div>`).join('')}</div>`)}${section('03', 'Permissions', radio('Whether the work has been published before?', 'published') + radio('Is this a commercial product?', 'commercial') + radio('Any commercial or industry support?', 'industry') + radio('Any other conflicts of interest?', 'conflict'))}${section('04', 'Author Agreement', `<div class="prose">${agreement}</div>`)}${section('05', 'Disclaimer', disclaimers.map((x, i) => `<label class="check"><input type="checkbox" name="agree${i}" required ${draft['agree' + i] ? 'checked' : ''}><span>${x} *</span></label>`).join(''))}<div class="form-actions"><button class="secondary" type="button" id="save-draft">Save draft</button><button class="primary" type="submit">Submit abstract ${icon('arrow')}</button></div><div class="card prose">${notes}</div></form>`
  );
}
function render() {
  let page = location.hash.slice(1) || document.body.dataset.page || 'instructions';
  if (!pages.some((p) => p[0] === page)) page = 'instructions';
  $('nav')
    .querySelectorAll('[data-page]')
    .forEach((x) => {
      x.classList.toggle('active', x.dataset.page === page);
      if (x.dataset.page === page) x.setAttribute('aria-current', 'page');
      else x.removeAttribute('aria-current');
    });
  $('#crumb').textContent = pages.find((x) => x[0] === page)[2];
  $('.avatar').textContent = profile.name
    .split(' ')
    .filter(Boolean)
    .map((x) => x[0])
    .filter((x) => /[a-z]/i.test(x))
    .slice(0, 2)
    .join('');
  let html = '';
  if (page === 'instructions') html = head('DELEGATE PORTAL', 'Instructions', '') + instructions();
  if (page === 'submit') html = submit();
  if (page === 'profile')
    html =
      head('DELEGATE PORTAL', 'User profile', '') +
      preview +
      `<form id="profile-form">${section('01', 'Personal information', `<div class="form-grid">${field('Title', 'title', profile.title)}${field('Name *', 'name', profile.name, 'text', 'required')}${field('Email *', 'email', profile.email, 'email', 'required')}${field('Date of birth *', 'dob', profile.dob, 'date', 'required')}<div class="field"><label for="gender">Gender *</label><select id="gender" name="gender" required>${['Male', 'Female', 'Other', 'Prefer not to say'].map((x) => `<option ${profile.gender === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>${field('Mobile *', 'mobile', profile.mobile, 'tel', 'required pattern="[+0-9 ()-]{7,20}"')}${field('WhatsApp number', 'whatsapp', profile.whatsapp, 'tel')}${field('Organization *', 'organization', profile.organization, 'text', 'required')}</div>`)}${section('02', 'Address & identity', `<div class="form-grid">${field('Address', 'address', profile.address)}${field('Country', 'country', profile.country)}${field('State', 'state', profile.state)}${field('City', 'city', profile.city)}${field('Zipcode', 'zip', profile.zip)}${field('Aadhaar number', 'aadhaar', '', 'text', 'inputmode="numeric" pattern="[0-9]{12}" maxlength="12" autocomplete="off" placeholder="Enter 12-digit Aadhaar number"')}${['Aadhaar photo', 'Passport size photo'].map((x, i) => `<div class="field"><label for="photo${i}">Upload ${x}</label><input type="file" id="photo${i}" accept="image/png,image/jpeg,image/webp"><small>Minimum 150 × 150 px. Maximum 512 KB.</small><span id="photo-status${i}">No image available.</span><img id="photo-preview${i}" class="upload-preview" hidden alt="${x} preview"></div>`).join('')}</div>`)}<div class="form-actions"><button class="primary">Save profile ${icon('arrow')}</button></div></form>`;
  if (page === 'password')
    html =
      head('DELEGATE PORTAL', 'Change password', '') +
      `<div class="card password-card"><form id="password-form"><div class="form-grid">${field('Current password *', 'current', '', 'password', 'required autocomplete="current-password"')}${field('New password *', 'new-password', '', 'password', 'required minlength="8" autocomplete="new-password"')}${field('Confirm new password *', 'confirm-password', '', 'password', 'required minlength="8" autocomplete="new-password"')}</div><p class="subtitle" style="font-size:11px;margin-top:18px">Use at least 8 characters for your new password.</p><div class="form-actions"><button class="primary">Update password ↗</button></div></form></div>`;
  $('#content').innerHTML =
    `<section class="welcome-banner"><div class="welcome-person"><span>Welcome back</span><strong>${safe(profile.title)} ${safe(profile.name)}</strong></div><div class="welcome-art" aria-hidden="true"></div><div class="banner-event"><strong>IPSCON ’26</strong><span>Kolkata · 27 Nov 2026</span></div><div class="event-countdown" aria-label="Countdown to 27 November 2026"><div class="countdown-units"><span><b data-count="days">00</b><small>Days</small></span><i>:</i><span><b data-count="hours">00</b><small>Hrs</small></span><i>:</i><span><b data-count="minutes">00</b><small>Min</small></span><i>:</i><span><b data-count="seconds">00</b><small>Sec</small></span></div></div><a class="top-profile" href="dashboard-profile.html" aria-label="Open user profile">${icon('profile')}</a></section>` +
    html;
  $('.welcome-banner').insertAdjacentElement('afterend', portalHeader);
  $('#crumb-icon').innerHTML = icon(page);
  updateCountdown();
  bind(page);
}
function toast(text) {
  $('.toast').textContent = text;
  $('.toast').hidden = false;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => ($('.toast').hidden = true), 5000);
}
function words() {
  return ['purpose', 'methods', 'results', 'conclusion']
    .map((k) => $('#' + k).value.trim())
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
function count() {
  let n = words();
  $('#word-count').textContent = `${n} / 300 words`;
  $('#word-count').classList.toggle('over', n > 300);
  $('#purpose').setCustomValidity(
    n > 300 ? 'The abstract must contain no more than 300 words.' : '',
  );
}
function getDraft() {
  let data = Object.fromEntries(new FormData($('#abstract-form')));
  data.coauthors = [...document.querySelectorAll('.coauthor')].map((row) =>
    Object.fromEntries([...row.querySelectorAll('input')].map((i) => [i.dataset.key, i.value])),
  );
  return data;
}
function addAuthor(a = {}) {
  let div = document.createElement('div');
  div.className = 'coauthor card';
  div.innerHTML = `<h3>Additional author</h3><div class="form-grid">${['name', 'affiliation', 'city', 'state', 'country', 'email'].map((k) => `<div class="field"><label>${k[0].toUpperCase() + k.slice(1)} *<input aria-label="Coauthor ${k}" data-key="${k}" type="${k === 'email' ? 'email' : 'text'}" value="${safe(a[k] || '')}" required></label></div>`).join('')}</div><button type="button" class="text-link" style="margin-top:15px">Remove author</button>`;
  div.querySelector('button').onclick = () => {
    if ($('#author-list').children.length > 1) div.remove();
    else toast('Choose No if there are no additional authors.');
  };
  $('#author-list').append(div);
  toggleAuthors();
}
function toggleAuthors() {
  let yes = $('input[name=additional]:checked')?.value === 'Yes';
  $('#coauthors').hidden = !yes;
  document.querySelectorAll('.coauthor input').forEach((i) => (i.disabled = !yes));
}
function bind(page) {
  if (page === 'instructions') {
    document
      .querySelectorAll('[data-registration]')
      .forEach((b) => (b.onclick = () => location.assign('register.html')));
    $('#manage-abstracts').onclick = () => {
      const status = $('#abstract-status');
      status.hidden = !status.hidden;
      $('#manage-abstracts').setAttribute('aria-expanded', String(!status.hidden));
    };
    $('#manage-abstracts').setAttribute('aria-controls', 'abstract-status');
    $('#manage-abstracts').setAttribute('aria-expanded', 'false');
  }
  if (page === 'submit') {
    (draft.coauthors?.length ? draft.coauthors : [{}]).forEach(addAuthor);
    $('#add-author').onclick = () => addAuthor();
    document
      .querySelectorAll('input[name=additional]')
      .forEach((i) => (i.onchange = toggleAuthors));
    $('#abstract-form').addEventListener('input', count);
    count();
    $('#save-draft').onclick = () => {
      draft = getDraft();
      save('wac-draft', draft);
      toast('Draft saved.');
    };
    $('#abstract-form').onsubmit = (e) => {
      e.preventDefault();
      count();
      if (words() > 300) return;
      if (abstracts.length >= 2) {
        toast('You have reached the limit of two abstracts.');
        return;
      }
      const a = getDraft();
      a.id = 'WAC-LOCAL-' + String(abstracts.length + 1).padStart(3, '0');
      a.date = new Date().toLocaleDateString('en-IN');
      a.words = words();
      abstracts.push(a);
      save('wac-abstracts', abstracts);
      draft = {};
      localStorage.removeItem('wac-draft');
      location.assign(pageUrls.instructions);
    };
  }
  if (page === 'profile') {
    $('#profile-form').onsubmit = (e) => {
      e.preventDefault();
      let data = Object.fromEntries(new FormData(e.target));
      delete data.aadhaar;
      profile = data;
      save('wac-profile', profile);
      toast('Profile saved.');
      $('.avatar').textContent = profile.name
        .split(' ')
        .map((s) => s[0])
        .slice(0, 2)
        .join('');
    };
    [0, 1].forEach(
      (i) =>
        ($('#photo' + i).onchange = async (e) => {
          const f = e.target.files[0];
          if (!f) return;
          const status = $('#photo-status' + i),
            img = $('#photo-preview' + i);
          img.hidden = true;
          if (f.size > 512 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(f.type)) {
            status.textContent = 'Choose a JPG, PNG or WebP image up to 512 KB.';
            e.target.value = '';
            return;
          }
          let url = URL.createObjectURL(f),
            probe = new Image();
          probe.onload = () => {
            if (probe.width < 150 || probe.height < 150) {
              status.textContent = 'Image must be at least 150 × 150 px.';
              e.target.value = '';
              URL.revokeObjectURL(url);
              return;
            }
            if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
            img.src = url;
            img.dataset.url = url;
            img.hidden = false;
            status.textContent = f.name;
          };
          probe.onerror = () => {
            status.textContent = 'This image could not be read.';
            e.target.value = '';
            URL.revokeObjectURL(url);
          };
          probe.src = url;
        }),
    );
  }
  if (page === 'password') {
    $('#confirm-password').oninput = () => $('#confirm-password').setCustomValidity('');
    $('#password-form').onsubmit = (e) => {
      e.preventDefault();
      const match = $('#new-password').value === $('#confirm-password').value;
      $('#confirm-password').setCustomValidity(match ? '' : 'Passwords do not match.');
      if (!match) {
        $('#confirm-password').reportValidity();
        return;
      }
      toast('For password assistance, contact helpdesk@ipswb.com.');
      e.target.reset();
    };
  }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('a[data-page],button[data-page]');
  if (b) {
    e.preventDefault();
    location.assign(pageUrls[b.dataset.page]);
    document.body.classList.remove('menu-open');
    $('#menu').setAttribute('aria-expanded', 'false');
  }
});
$('#menu').onclick = () => {
  const open = document.body.classList.toggle('menu-open');
  $('#menu').setAttribute('aria-expanded', open);
};
$('#close-menu').onclick = () => {
  document.body.classList.remove('menu-open');
  $('#menu').setAttribute('aria-expanded', 'false');
  $('#menu').focus();
};
$('.shade').onclick = () => {
  document.body.classList.remove('menu-open');
  $('#menu').setAttribute('aria-expanded', 'false');
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') $('.shade').click();
});
$('#signout').onclick = () => {
  sessionStorage.removeItem('delegate-email');
  sessionStorage.removeItem('delegate-preview');
  location.assign('login.html');
};
addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
  $('#content').focus({ preventScroll: true });
});
render();
const mobileMenu = matchMedia('(max-width:760px)');
function syncDrawer() {
  const closed = mobileMenu.matches && !document.body.classList.contains('menu-open');
  $('.sidebar').inert = closed;
  $('#menu').setAttribute('aria-label', closed ? 'Open menu' : 'Close menu');
}
new MutationObserver(syncDrawer).observe(document.body, {
  attributes: true,
  attributeFilter: ['class'],
});
mobileMenu.addEventListener('change', syncDrawer);
syncDrawer();

function updateCountdown() {
  const remaining = Math.max(0, new Date('2026-11-27T00:00:00+05:30').getTime() - Date.now());
  const seconds = Math.floor(remaining / 1000);
  const values = {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
  for (const [key, value] of Object.entries(values)) {
    const el = document.querySelector(`[data-count="${key}"]`);
    if (el) el.textContent = String(value).padStart(2, '0');
  }
  const caption = document.querySelector('.countdown-caption');
  if (caption) caption.textContent = remaining ? '27 NOV 2026' : '27 NOV 2026 · EVENT DAY';
}
setInterval(updateCountdown, 1000);
